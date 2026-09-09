using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public class Database : DbContext
{
    public DbSet<Project> Projects { get; set; }
    public DbSet<Column> Columns { get; set; }
    public DbSet<Card> Cards { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string? host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
        string? port = Environment.GetEnvironmentVariable("POSTGRES_PORT");
        string? password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

        string connectionString = $"Host={host};Port={port};Username=postgres;Password={password};Database=kanban-database";

        optionsBuilder.UseNpgsql(connectionString);
    }
}
