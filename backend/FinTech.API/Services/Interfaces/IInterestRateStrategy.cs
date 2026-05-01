namespace FinTech.API.Services.Interfaces
{
    public interface IInterestRateStrategy
    {
        decimal CalculateMonthlyInstallment(decimal amount, decimal tea, int term);

        decimal CalculateMonthlyRate(decimal tea);
    }
}
