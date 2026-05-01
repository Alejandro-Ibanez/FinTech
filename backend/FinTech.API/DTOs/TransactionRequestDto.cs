using FinTech.API.Models.Enums;

namespace FinTech.API.DTOs
{
    public class TransactionRequestDto
    {
        public Guid LoanId { get; set; }
        public decimal Amount { get; set; }
        public TransactionType Type { get; set; }
        public string IdempotencyKey { get; set; } = string.Empty;
    }
}
