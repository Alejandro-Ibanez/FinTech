
using FinTech.API.DTOs;
using FinTech.API.Factories;
using FinTech.API.Models;
using FinTech.API.Models.Enums;
using FinTech.API.Repositories.Inferfaces;
using FinTech.API.Services.Interfaces;

namespace FinTech.API.Services
{
    public class LoanService(LoanFactory loanFactory, ILoanRepository loanRepository, IInterestRateStrategy interestRateStrategy, ITransactionService transactionService) : ILoanService
    {
        public async Task<LoanResponseDto> SimulateLoanAsync(LoanRequestDto request)
        {
            //Validations
            ValidateLoanRequest(request.Amount, request.Term, request.TEA);

            // Factory return calc and schedules
            var loan = loanFactory.CreateLoan(request.UserId, request.Amount, request.TEA, request.Term, request.LoanType);
            return MapToResponse(loan);
        }
        public async Task<LoanResponseDto> CreateLoanRequestAsync(LoanRequestDto request)
        {
            //Valistions
            ValidateLoanRequest(request.Amount, request.Term, request.TEA);

            // Active Loans no more than 3 and information for scoring
            var userLoans = await loanRepository.GetActiveLoansByUserIdAsync(request.UserId);
            if (userLoans.Count >= 3)
                throw new InvalidOperationException("El cliente no puede tener más de 3 préstamos activos.");

            // Create object using the factory
            var loan = loanFactory.CreateLoan(request.UserId, request.Amount, request.TEA, request.Term, request.LoanType);
            decimal newMonthlyPayment = loan.LoanType == LoanType.Fixed ? loan.MonthlyPayent : loan.Schedules.First().TotalPayment;

            // Rule 40% income
            decimal currentTotalCommitment = userLoans.Sum(l => l.MonthlyPayent);
            decimal maxAllowedCommitment = request.MonthlyIncome * 0.40m;

            if ((currentTotalCommitment + newMonthlyPayment) > maxAllowedCommitment)
                throw new InvalidOperationException($"La cuota excede el 40% de sus ingresos mensuales (Máx permitido: ${maxAllowedCommitment:F2}).");

            // Rule Approve scoring
            if (request.Amount < 10000 && userLoans.Count < 2)
            {
                loan.Status = LoanStatus.Approved;
                loan.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                loan.Status = LoanStatus.Pending;
            }

            //Persistence
            await loanRepository.AddAsync(loan);
            await loanRepository.SaveChangesAsync();

            return MapToResponse(loan);
        }
        public async Task<bool> ApproveLoanAsync(Guid id)
        {
            var loan = await loanRepository.GetByIdAsync(id);
            if (loan == null || loan.Status != LoanStatus.Pending) return false;

            loan.Status = LoanStatus.Approved;
            loan.UpdatedAt = DateTime.UtcNow;

            // idempotency key
            await transactionService.CreateTransactionAsync(new TransactionRequestDto
            {
                LoanId = loan.Id,
                Amount = loan.Amount,
                Type = TransactionType.Disbursement,
                IdempotencyKey = $"DISB-{loan.Id}"
            });

            await loanRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectLoanAsync(Guid id)
        {
            var loan = await loanRepository.GetByIdAsync(id);
            if (loan == null) return false;

            loan.Status = LoanStatus.Rejected;
            loan.UpdatedAt = DateTime.UtcNow;
            await loanRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<LoanResponseDto>> GetAllAsync(string? userId)
        {
            var loans = await loanRepository.GetAllAsync(userId);
            return loans.Select(MapToResponse);
        }

        public async Task<LoanResponseDto?> GetByIdAsync(Guid id)
        {
            var loan = await loanRepository.GetByIdAsync(id);
            return loan != null ? MapToResponse(loan) : null;
        }

        public async Task<List<ScheduleDto>> GetScheduleAsync(Guid loanId)
        {
            var loan = await loanRepository.GetByIdAsync(loanId);
            if (loan == null) return new List<ScheduleDto>();

            return MapToResponse(loan).Schedule;
        }

        private void ValidateLoanRequest(decimal amount, int term, decimal tea)
        {
            if (amount < 500 || amount > 50000)
                throw new ArgumentException("Monto fuera de rango ($500 - $50,000).");

            if (term < 6 || term > 60)
                throw new ArgumentException("El plazo debe ser entre 6 y 60 meses.");

            if (tea < 0.18m || tea > 0.35m)
                throw new ArgumentException("La TEA debe estar entre 18% y 35%.");
        }

        private LoanResponseDto MapToResponse(Loan loan)
        {
            return new LoanResponseDto
            {
                LoanId = loan.Id,
                Status = loan.Status.ToString(),
                MonthlyPayment = loan.MonthlyPayent,
                Schedule = loan.Schedules
            .OrderBy(s => s.PaymentNumber)
            .Select(s => new ScheduleDto
            {
                PaymentNumber = s.PaymentNumber,
                DueDate = s.DueDate,
                TotalPayment = s.TotalPayment,
                Principal = s.Principal,
                Interest = s.Interest,
                RemainingBalance = s.RemainingBalance,
                Status = s.Status
            }).ToList()
            };
        }
    }
}
