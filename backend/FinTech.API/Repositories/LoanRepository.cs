using FinTech.API.Data;
using FinTech.API.Models;
using FinTech.API.Models.Enums;
using FinTech.API.Repositories.Inferfaces;
using Microsoft.EntityFrameworkCore;

namespace FinTech.API.Repositories
{
    public class LoanRepository(ApplicationDbContext context) : ILoanRepository
    {
        public async Task<Loan?> GetByIdAsync(Guid id)
        {
            return await context.Loans
                .Include(l => l.Schedules) //Include the payments shcedule
                .Include(l => l.Transactions)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Loan>> GetAllAsync(string? userId)
        {
            var query = context.Loans.AsQueryable();

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(l => l.UserId == userId);

            return await query
                .Include(l => l.Schedules)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(Loan loan)
        {
            await context.Loans.AddAsync(loan);
        }

        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }

        public async Task<List<Loan>> GetActiveLoansByUserIdAsync(string userId)
        {
            return await context.Loans
                .Where(l => l.UserId == userId &&
                           (l.Status == LoanStatus.Approved ||
                            l.Status == LoanStatus.Pending ||
                            l.Status == LoanStatus.Active))
                .ToListAsync();
        }
        public async Task<Loan?> GetByIdWithScheduleAsync(Guid id)
        {
            return await context.Loans
                .Include(l => l.Schedules)
                .FirstOrDefaultAsync(l => l.Id == id);
        }
    }
}
