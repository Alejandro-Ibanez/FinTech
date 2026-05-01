using FinTech.API.Data;
using FinTech.API.Factories;
using FinTech.API.Repositories;
using FinTech.API.Repositories.Inferfaces;
using FinTech.API.Services;
using FinTech.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("ProjectConnection"));
});

//Repositories
builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
//Services
builder.Services.AddScoped<ILoanService, LoanService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
//Factory and Strategy
builder.Services.AddScoped<IInterestRateStrategy, FrenchInterestStrategy>();
builder.Services.AddScoped<LoanFactory>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
