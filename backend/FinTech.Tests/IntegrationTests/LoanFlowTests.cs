using FinTech.API.DTOs;
using FinTech.API.Factories;
using FinTech.API.Models;
using FinTech.API.Models.Enums;
using FinTech.API.Repositories.Inferfaces;
using FinTech.API.Services;
using FinTech.API.Services.Interfaces;
using Moq;

namespace FinTech.Tests.IntegrationTests
{
    public class LoanFlowTests
    {
        [Fact]
        public async Task AutomaticScoring_AmountUnder10k_ShouldBeApprovedImmediately()
        {
            // Arrange
            var mockRepo = new Mock<ILoanRepository>();
            var service = new LoanService(new LoanFactory(), mockRepo.Object, new FrenchInterestStrategy(), new Mock<ITransactionService>().Object);

            mockRepo.Setup(r => r.GetActiveLoansByUserIdAsync(It.IsAny<string>())).ReturnsAsync(new List<Loan>());

            var request = new LoanRequestDto { Amount = 5000, Term = 12, TEA = 0.20m, MonthlyIncome = 5000 };

            // Act
            var response = await service.CreateLoanRequestAsync(request);

            // Assert
            Assert.Equal(LoanStatus.Approved.ToString(), response.Status);
        }

        [Fact]
        public async Task ManualApproval_ShouldStatusChangeAndTriggerDisbursement()
        {
            // Arrange
            var mockRepo = new Mock<ILoanRepository>();
            var mockTrans = new Mock<ITransactionService>();
            var service = new LoanService(new LoanFactory(), mockRepo.Object, new FrenchInterestStrategy(), mockTrans.Object);

            var loan = new Loan { Id = Guid.NewGuid(), Status = LoanStatus.Pending, Amount = 1000 };
            mockRepo.Setup(r => r.GetByIdAsync(loan.Id)).ReturnsAsync(loan);

            // Act
            await service.ApproveLoanAsync(loan.Id);

            // Assert
            Assert.Equal(LoanStatus.Approved, loan.Status);
            mockTrans.Verify(t => t.CreateTransactionAsync(It.Is<TransactionRequestDto>(
                d => d.IdempotencyKey == $"DISB-{loan.Id}"
            )), Times.Once);
        }
    }
}
