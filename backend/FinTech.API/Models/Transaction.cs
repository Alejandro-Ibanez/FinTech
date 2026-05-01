using FinTech.API.Models.Enums;

namespace FinTech.API.Models
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public string IdempotencyKey { get; set; } = string.Empty;
        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
        public Guid? LoanId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

    }
}
