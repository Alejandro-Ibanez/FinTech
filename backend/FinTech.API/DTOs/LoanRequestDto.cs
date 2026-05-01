using FinTech.API.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace FinTech.API.DTOs
{
    public class LoanRequestDto
    {
        [Required]
        public string UserId { get; set; } = string.Empty;

        [Range(500, 50000, ErrorMessage = "El monto debe estar entre 500 y 50,000")]
        public decimal Amount { get; set; }

        [Range(6, 60, ErrorMessage = "El plazo debe ser entre 6 y 60 meses")]
        public int Term { get; set; }

        [Range(0.18, 0.35, ErrorMessage = "La TEA debe estar entre 0.18 (18%) y 0.35 (35%)")]
        public decimal TEA { get; set; }

        [Required]
        public LoanType LoanType { get; set; }

        [Required]
        [Range(1, double.MaxValue, ErrorMessage = "Los ingresos deben ser mayores a 0")]
        public decimal MonthlyIncome { get; set; }
    }
}
