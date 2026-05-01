using FinTech.API.Models;
using FinTech.API.Models.Enums;

namespace FinTech.API.Repositories.Inferfaces
{
    public interface ITransactionRepository
    {
        Task<Transaction?> GetByIdAsync(Guid id);
        Task<Transaction?> GetByKeyAsync(string key); // Para Idempotencia
        Task<IEnumerable<Transaction>> GetAllAsync(TransactionType? type, TransactionStatus? status);
        Task AddAsync(Transaction transaction);
        Task SaveChangesAsync();
    }
}
