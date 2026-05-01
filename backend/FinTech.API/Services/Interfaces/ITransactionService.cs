using FinTech.API.DTOs;
using FinTech.API.Models.Enums;

namespace FinTech.API.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<TransactionResponseDto> CreateTransactionAsync(TransactionRequestDto request);
        Task<TransactionResponseDto?> GetByIdAsync(Guid id);
        Task<IEnumerable<TransactionResponseDto>> GetAllAsync(TransactionType? type, TransactionStatus? status);
    }
}
