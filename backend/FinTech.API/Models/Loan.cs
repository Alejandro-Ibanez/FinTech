using FinTech.API.Models.Enums;

namespace FinTech.API.Models
{
    public class Loan
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int Term { get; set; }
        public decimal InterestRate { get; set; }
        public LoanType LoanType { get; set; }
        public LoanStatus Status { get; set; } = LoanStatus.Pending;
        public decimal MonthlyPayent { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<PaymentSchedule> Schedules { get; set; } = new();
        public List<Transaction> Transactions { get; set; } = new();
    }
}
