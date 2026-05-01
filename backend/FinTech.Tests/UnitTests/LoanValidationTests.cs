using FinTech.API.DTOs;
using FinTech.API.Factories;
using FinTech.API.Models;
using FinTech.API.Repositories.Inferfaces;
using FinTech.API.Services;
using FinTech.API.Services.Interfaces;
using Moq;


namespace FinTech.Tests.UnitTests
{

    public class LoanValidationTests
    {
        private readonly Mock<ILoanRepository> _loanRepoMock = new();
        private readonly Mock<ITransactionService> _transServiceMock = new();
        private readonly LoanFactory _factory = new();

        private LoanService CreateService() =>
            new(_factory, _loanRepoMock.Object, new FrenchInterestStrategy(), _transServiceMock.Object);

        [Theory]
        [InlineData(499)]   // Menor al min
        [InlineData(50001)] // Mayor al max
        public async Task CreateLoan_AmountOutOfRange_ShouldThrowArgumentException(decimal amount)
        {
            var service = CreateService();
            var request = new LoanRequestDto { Amount = amount, Term = 12, TEA = 0.25m };

            await Assert.ThrowsAsync<ArgumentException>(() => service.CreateLoanRequestAsync(request));
        }

        [Fact]
        public async Task CreateLoan_MoreThan3ActiveLoans_ShouldThrowInvalidOperationException()
        {
            var service = CreateService();
            _loanRepoMock.Setup(r => r.GetActiveLoansByUserIdAsync(It.IsAny<string>()))
                .ReturnsAsync(new List<Loan> { new(), new(), new() }); // Ya tiene 3

            var request = new LoanRequestDto { UserId = "u1", Amount = 1000, Term = 12, TEA = 0.25m };

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateLoanRequestAsync(request));
        }

        [Fact]
        public async Task CreateLoan_Exceeds40PercentIncome_ShouldThrowInvalidOperationException()
        {
            // Edge Case: El usuario gana $1,000, ya paga $300 en otros préstamos. 
            // Pide uno nuevo cuya cuota es $150. Total $450 (45%). Debe rebotar.
            var service = CreateService();
            var userLoans = new List<Loan> { new() { MonthlyPayent = 300 } };
            _loanRepoMock.Setup(r => r.GetActiveLoansByUserIdAsync(It.IsAny<string>())).ReturnsAsync(userLoans);

            var request = new LoanRequestDto
            {
                UserId = "u1",
                Amount = 10000, // Una cuota alta
                Term = 12,
                TEA = 0.30m,
                MonthlyIncome = 1000
            };

            var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.CreateLoanRequestAsync(request));
            Assert.Contains("40%", ex.Message);
        }
    }

}
