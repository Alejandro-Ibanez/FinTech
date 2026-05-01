using FinTech.API.Data;
using FinTech.API.Models;
using FinTech.API.Models.Enums;
using FinTech.API.Repositories.Inferfaces;
using Microsoft.EntityFrameworkCore;

namespace FinTech.API.Repositories
{
    public class TransactionRepository(ApplicationDbContext context) : ITransactionRepository
    {
        public async Task<Transaction?> GetByIdAsync(Guid id) => await context.Transactions.FindAsync(id);

        public async Task<Transaction?> GetByKeyAsync(string key)
            => await context.Transactions.FirstOrDefaultAsync(t => t.IdempotencyKey == key);

        public async Task<IEnumerable<Transaction>> GetAllAsync(TransactionType? type, TransactionStatus? status)
        {
            var query = context.Transactions.AsQueryable();

            if (!string.IsNullOrEmpty(type.ToString()))
                query = query.Where(t => t.Type == type);

            if (!string.IsNullOrEmpty(status.ToString()))
                query = query.Where(t => t.Status == status);

            return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        }

        public async Task AddAsync(Transaction transaction) => await context.Transactions.AddAsync(transaction);
        public async Task SaveChangesAsync() => await context.SaveChangesAsync();
    }
}
