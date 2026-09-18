namespace backend.Database.Models;

public class Card
{
    public required string Id { get; set; }
    public required string Content { get; set; }
    public int OrderNr { get; set; }

    public required string ColumnId { get; set; }
    public Column Column { get; set; } = null!;
}
