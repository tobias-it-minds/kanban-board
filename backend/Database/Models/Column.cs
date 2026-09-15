namespace backend.Database.Models;

public class Column
{
    public required string Id { get; set; }
    public required string Name { get; set; }

    public required string ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public ICollection<Card> Cards { get; } = [];
}
