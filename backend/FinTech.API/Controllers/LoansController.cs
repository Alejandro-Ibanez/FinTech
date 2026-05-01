using FinTech.API.DTOs;
using FinTech.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FinTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController(ILoanService loanService) : ControllerBase
    {
        [HttpPost("simulate")]
        public async Task<IActionResult> Simulate([FromBody] LoanRequestDto request)
         => Ok(await loanService.SimulateLoanAsync(request));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoanRequestDto request)
        {
            var result = await loanService.CreateLoanRequestAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = result.LoanId }, result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? userId)
            => Ok(await loanService.GetAllAsync(userId));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var loan = await loanService.GetByIdAsync(id);
            return loan != null ? Ok(loan) : NotFound();
        }

        [HttpGet("{id}/schedule")]
        public async Task<IActionResult> GetSchedule(Guid id)
            => Ok(await loanService.GetScheduleAsync(id));

        [HttpPatch("{id}/approve")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var success = await loanService.ApproveLoanAsync(id);
            return success ? NoContent() : BadRequest("No se pudo aprobar el préstamo.");
        }

        [HttpPatch("{id}/reject")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var success = await loanService.RejectLoanAsync(id);
            return success ? NoContent() : BadRequest("No se pudo rechazar el préstamo.");
        }
    }
}
