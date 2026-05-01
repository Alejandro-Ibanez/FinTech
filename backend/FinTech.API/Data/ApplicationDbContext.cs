using FinTech.API.Models;
using FinTech.API.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace FinTech.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Loan> Loans { get; set; }
        public DbSet<PaymentSchedule> Schedules { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Decimal Configuration
            foreach (var property in modelBuilder.Model.GetEntityTypes()
               .SelectMany(t => t.GetProperties())
               .Where(p => p.ClrType == typeof(decimal)))
            {
                property.SetColumnType("decimal(18,2)");
            }

            //Relation Loan - Transaction
            modelBuilder.Entity<Transaction>()
                .HasOne<Loan>()
                .WithMany(l => l.Transactions)
                .HasForeignKey(t => t.LoanId)
                .OnDelete(DeleteBehavior.Restrict);

            //Relation Loan - Schedules Payment
            modelBuilder.Entity<PaymentSchedule>()
                .HasOne<Loan>()
                .WithMany(l => l.Schedules)
                .HasForeignKey(s => s.LoanId)
                .OnDelete(DeleteBehavior.Cascade);

            //Unique Index
            modelBuilder.Entity<Transaction>()
                .HasIndex(t => t.IdempotencyKey)
                .IsUnique();

            //Seed Data
            var User1Id = "user-alpha-01";
            var User2Id = "user-beta-02";

            modelBuilder.Entity<Loan>().HasData(
                new Loan
                {
                    Id = Guid.Parse("a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d"),
                    UserId = User1Id,
                    Amount = 1000m,
                    Term = 12,
                    InterestRate = 10.5m,
                    LoanType = LoanType.Fixed,
                    Status = LoanStatus.Approved,
                    CreatedAt = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc),
                });
        }
    }
}