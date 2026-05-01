namespace FinTech.API.DTOs
{
    public class TransactionResponseDto
    {
        public Guid Id { get; set; }
        public Guid? LoanId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string IdempotencyKey { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
