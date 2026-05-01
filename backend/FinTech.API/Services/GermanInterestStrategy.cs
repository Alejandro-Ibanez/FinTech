using FinTech.API.Services.Interfaces;

namespace FinTech.API.Services
{
    public class GermanInterestStrategy : IInterestRateStrategy
    {
        public decimal CalculateMonthlyRate(decimal tea)
        {
            double teaDouble = (double)tea;
            return (decimal)(Math.Pow(1 + teaDouble, 1.0 / 12.0) - 1);
        }

        public decimal CalculateMonthlyInstallment(decimal amount, decimal tea, int term)
        {
            // return the first cuota the most highest as a refrency.
            decimal tem = CalculateMonthlyRate(tea);
            decimal fixedPrincipal = amount / term;
            decimal firstInterest = amount * tem;

            return fixedPrincipal + firstInterest;
        }
    }
}
