using FinTech.API.DTOs;
using FinTech.API.Models.Enums;
using FinTech.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.API.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionsController(ITransactionService transactionService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TransactionRequestDto request)
        {
            var result = await transactionService.CreateTransactionAsync(request);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? type, [FromQuery] int? status)
            => Ok(await transactionService.GetAllAsync((TransactionType?)type, (TransactionStatus?)status));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await transactionService.GetByIdAsync(id);
            return result != null ? Ok(result) : NotFound();
        }
    }
}
