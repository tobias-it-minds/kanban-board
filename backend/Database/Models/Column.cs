namespace backend.Database.Models;

public class Column
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public List<Card> Cards { get; }
}
