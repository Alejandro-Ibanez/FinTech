using FinTech.API.Models;

namespace FinTech.API.Repositories.Inferfaces
{
    public interface ILoanRepository
    {
        Task<Loan?> GetByIdAsync(Guid id);
        Task<IEnumerable<Loan>> GetAllAsync(string? userId);
        Task AddAsync(Loan loan);
        Task SaveChangesAsync();
        Task<List<Loan>> GetActiveLoansByUserIdAsync(string userId);
    }
}
