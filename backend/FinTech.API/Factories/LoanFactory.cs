using FinTech.API.Models;
using FinTech.API.Models.Enums;
using FinTech.API.Services;
using FinTech.API.Services.Interfaces;

namespace FinTech.API.Factories
{
    public class LoanFactory()
    {
        private readonly IInterestRateStrategy _frenchStrategy = new FrenchInterestStrategy();
        private readonly IInterestRateStrategy _germanStrategy = new GermanInterestStrategy();
        public Loan CreateLoan(string userId, decimal amount, decimal tea, int term, LoanType loanType)
        {
            IInterestRateStrategy strategy = loanType == LoanType.Fixed ? _frenchStrategy : _germanStrategy;

            var monthlyRate = strategy.CalculateMonthlyRate(tea);
            bool isGerman = loanType == LoanType.Decreasing;

            decimal fixedPrincipal = isGerman ? (amount / term) : 0;
            decimal fixedInstallment = !isGerman ? strategy.CalculateMonthlyInstallment(amount, tea, term) : 0;

            var loan = new Loan
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = amount,
                Term = term,
                InterestRate = tea,
                LoanType = loanType,
                Status = LoanStatus.Pending,
                MonthlyPayent = isGerman ? 0 : fixedInstallment,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Schedules = new List<PaymentSchedule>()
            };

            decimal remainingBalance = amount;
            DateTime startDate = DateTime.UtcNow;
            int originalDay = startDate.Day;//Save the origin date 31 example

            for (int i = 1; i <= term; i++)
            {
                // Dates ogic 30/31
                DateTime targetMonth = startDate.AddMonths(i);
                int daysInMonth = DateTime.DaysInMonth(targetMonth.Year, targetMonth.Month);
                int dayToUse = Math.Min(originalDay, daysInMonth);
                DateTime dueDate = new DateTime(targetMonth.Year, targetMonth.Month, dayToUse, 0, 0, 0, DateTimeKind.Utc);

                // calcs amottization
                decimal interest = remainingBalance * monthlyRate;

                // amortization depend system
                decimal principal = isGerman ? fixedPrincipal : (fixedInstallment - interest);
                decimal currentTotalPayment = principal + interest;

                remainingBalance -= principal;

                // Adjust pressicion last payment
                if (i == term)
                {
                    if (isGerman) principal += remainingBalance;
                    else currentTotalPayment += remainingBalance;
                    remainingBalance = 0;
                }

                loan.Schedules.Add(new PaymentSchedule
                {
                    Id = Guid.NewGuid(),
                    LoanId = loan.Id,
                    PaymentNumber = i,
                    DueDate = dueDate,
                    TotalPayment = Math.Round(currentTotalPayment, 2),
                    Principal = Math.Round(principal, 2),
                    Interest = Math.Round(interest, 2),
                    RemainingBalance = Math.Round(Math.Max(0, remainingBalance), 2),
                    Status = PaymentStatus.Pending
                });
            }

            return loan;
        }
    }
}
