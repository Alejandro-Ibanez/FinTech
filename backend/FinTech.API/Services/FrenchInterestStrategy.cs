using FinTech.API.Services.Interfaces;

namespace FinTech.API.Services
{
    public class FrenchInterestStrategy : IInterestRateStrategy
    {
        public decimal CalculateMonthlyRate(decimal tea)
        {
            // (1 + TEA)^(1/12) - 1
            double teaDouble = (double)tea;
            double tem = Math.Pow(1 + teaDouble, 1.0 / 12.0) - 1;

            return (decimal)tem;
        }

        public decimal CalculateMonthlyInstallment(decimal amount, decimal tea, int term)
        {
            decimal tem = CalculateMonthlyRate(tea);
            double i = (double)tem;
            double n = term;
            double p = (double)amount;

            // R = P * [ (i * (1+i)^n) / ((1+i)^n - 1) ]
            double installment = p * (i * Math.Pow(1 + i, n)) / (Math.Pow(1 + i, n) - 1);

            return (decimal)installment;
        }
    }
}
