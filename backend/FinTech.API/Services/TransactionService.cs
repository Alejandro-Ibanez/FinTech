using FinTech.API.DTOs;
using FinTech.API.Models;
using FinTech.API.Models.Enums;
using FinTech.API.Repositories.Inferfaces;
using FinTech.API.Services.Interfaces;

namespace FinTech.API.Services
{
    public class TransactionService(ITransactionRepository transactionRepository, ILoanRepository loanRepository) : ITransactionService
    {
        public async Task<TransactionResponseDto> CreateTransactionAsync(TransactionRequestDto dto)
        {
            var existing = await transactionRepository.GetByKeyAsync(dto.IdempotencyKey);
            if (existing != null) return MapToResponse(existing);

            var loan = await loanRepository.GetByIdWithScheduleAsync(dto.LoanId);
            if (loan == null) throw new Exception("Préstamo no encontrado");

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                LoanId = dto.LoanId,
                Amount = dto.Amount,
                Type = dto.Type,
                IdempotencyKey = dto.IdempotencyKey,
                Status = TransactionStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                var nextInstallment = loan.Schedules
                    .Where(s => s.Status != PaymentStatus.Paid)
                    .OrderBy(s => s.PaymentNumber)
                    .FirstOrDefault();

                if (nextInstallment != null)
                {
                    if (dto.Amount >= nextInstallment.TotalPayment)
                    {
                        nextInstallment.Status = PaymentStatus.Paid;
                        transaction.Status = TransactionStatus.Completed;
                    }
                    else
                    {
                        throw new Exception("El monto no cubre la cuota mínima.");
                    }
                }
                else
                {
                    throw new Exception("El préstamo ya se encuentra totalmente pagado.");
                }
            }
            catch (Exception ex)
            {
                transaction.Status = TransactionStatus.Failed;
                throw;
            }

            await transactionRepository.AddAsync(transaction);
            await transactionRepository.SaveChangesAsync();

            return MapToResponse(transaction);
        }

        public async Task<TransactionResponseDto?> GetByIdAsync(Guid id)
        {
            var t = await transactionRepository.GetByIdAsync(id);
            return t != null ? MapToResponse(t) : null;
        }

        public async Task<IEnumerable<TransactionResponseDto>> GetAllAsync(TransactionType? type, TransactionStatus? status)
        {
            var transactions = await transactionRepository.GetAllAsync(type, status);
            return transactions.Select(MapToResponse);
        }

        private TransactionResponseDto MapToResponse(Transaction t) => new()
        {
            Id = t.Id,
            IdempotencyKey = t.IdempotencyKey,
            Type = t.Type.ToString(),
            LoanId = t.LoanId,
            Amount = t.Amount,
            Status = t.Status.ToString(),
            CreatedAt = t.CreatedAt
        };
    }
}
