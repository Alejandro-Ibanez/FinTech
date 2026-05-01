using FinTech.API.Models.Enums;

namespace FinTech.API.DTOs
{
    public class LoanResponseDto
    {
        public Guid LoanId { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal MonthlyPayment { get; set; }
        public List<ScheduleDto> Schedule { get; set; } = new();
    }

    public class ScheduleDto
    {
        public int PaymentNumber { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalPayment { get; set; }
        public decimal Principal { get; set; }
        public decimal Interest { get; set; }
        public decimal RemainingBalance { get; set; }
        public PaymentStatus Status { get; set; }
    }
}
