using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Database;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<Project> Projects { get; set; }
    public DbSet<Column> Columns { get; set; }
    public DbSet<Card> Cards { get; set; }

}
