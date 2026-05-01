using FinTech.API.DTOs;
using FinTech.API.Models;
using FinTech.API.Repositories.Inferfaces;
using FinTech.API.Services;
using Moq;

namespace FinTech.Tests.IntegrationTests
{
    public class TransactionIdempotencyTests
    {
        [Fact]
        public async Task CreateTransaction_SameKeyTwice_ShouldNotCreateNewRecord()
        {
            // Arrange
            var mockRepo = new Mock<ITransactionRepository>();
            var mockLoanRepo = new Mock<ILoanRepository>();
            var service = new TransactionService(mockRepo.Object, mockLoanRepo.Object);
            var key = "unique-idempotency-key";
            var existingTransaction = new Transaction { Id = Guid.NewGuid(), IdempotencyKey = key };

            // Simulamos que la clave YA EXISTE
            mockRepo.Setup(r => r.GetByKeyAsync(key)).ReturnsAsync(existingTransaction);

            var request = new TransactionRequestDto { IdempotencyKey = key, Amount = 100 };

            // Act
            var result = await service.CreateTransactionAsync(request);

            // Assert
            Assert.Equal(existingTransaction.Id, result.Id);
            mockRepo.Verify(r => r.AddAsync(It.IsAny<Transaction>()), Times.Never); // No se agrega nada nuevo
        }
    }
}
