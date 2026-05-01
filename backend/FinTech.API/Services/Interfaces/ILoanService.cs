using FinTech.API.DTOs;

namespace FinTech.API.Services.Interfaces
{
    public interface ILoanService
    {
        Task<LoanResponseDto> SimulateLoanAsync(LoanRequestDto request);
        Task<LoanResponseDto> CreateLoanRequestAsync(LoanRequestDto request);
        Task<IEnumerable<LoanResponseDto>> GetAllAsync(string? userId);
        Task<LoanResponseDto?> GetByIdAsync(Guid id);
        Task<List<ScheduleDto>> GetScheduleAsync(Guid loanId);
        Task<bool> ApproveLoanAsync(Guid id);
        Task<bool> RejectLoanAsync(Guid id);
    }
}
