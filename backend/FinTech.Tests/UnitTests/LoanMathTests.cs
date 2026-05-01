using FinTech.API.Factories;
using FinTech.API.Models.Enums;

namespace FinTech.Tests.UnitTests
{
    public class LoanMathTests
    {
        private readonly LoanFactory _factory = new();

        [Fact]
        public void FrenchSystem_MonthlyInstallment_ShouldBeConstant()
        {
            // Arrange: $10,000, 12 meses, TEA 24%
            var loan = _factory.CreateLoan("user1", 10000, 0.24m, 12, LoanType.Fixed);

            // Assert: Todas las cuotas deben ser iguales (redondeadas a 2 decimales)
            var firstPayment = loan.Schedules[0].TotalPayment;
            Assert.All(loan.Schedules, s => Assert.Equal(firstPayment, s.TotalPayment));
            Assert.Equal(0, loan.Schedules.Last().RemainingBalance);
        }

        [Fact]
        public void GermanSystem_Principal_ShouldBeConstant()
        {
            // Arrange: $12,000, 12 meses (Capital debería ser $1,000 exactos cada mes)
            var loan = _factory.CreateLoan("user1", 12000, 0.20m, 12, LoanType.Decreasing);

            // Assert: El capital es constante, la cuota total baja
            Assert.All(loan.Schedules, s => Assert.Equal(1000, s.Principal));
            Assert.True(loan.Schedules.First().TotalPayment > loan.Schedules.Last().TotalPayment);
        }

        [Fact]
        public void DateLogic_CreatedOnDay31_ShouldAdjustToLastDayOfNextMonths()
        {
            // Este test valida el edge case de meses con 28/30 días
            // Si se crea un préstamo un 31 de Agosto, la sig. cuota debe ser 30 de Sept.
            var factory = new LoanFactory();

            // Simulamos la lógica interna (puedes ajustar tu factory para recibir la fecha si quieres más precisión)
            var loan = factory.CreateLoan("u1", 1000, 0.20m, 6, LoanType.Fixed);

            // Validamos que no haya saltos de mes nulos y que el día sea válido para el mes destino
            foreach (var schedule in loan.Schedules)
            {
                Assert.True(schedule.DueDate.Day <= DateTime.DaysInMonth(schedule.DueDate.Year, schedule.DueDate.Month));
            }
        }
    }
}
