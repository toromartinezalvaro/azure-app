using Microsoft.EntityFrameworkCore;
using azure_app_server.Models;

namespace azure_app_server.Data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }

    public DbSet<Expense> Expenses { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Esto es solo para desarrollo local
            optionsBuilder.UseNpgsql("Host=azure-app-db.postgres.database.azure.com;Port=5432;Database=postgres;Username=postgres;Password=postgres;SSL Mode=Require;Trust Server Certificate=true");
        }
    }
} 