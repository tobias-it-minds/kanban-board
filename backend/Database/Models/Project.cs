namespace backend.Database.Models;

public class Project
{
    public required string Id { get; set; }
    public required string OwnerId { get; set; }
    public required string Name { get; set; }

    public ICollection<Column> Columns { get; } = [];
}
