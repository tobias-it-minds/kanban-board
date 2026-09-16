using backend.Database;
using backend.Database.Models;

namespace backend.Services;

public class CardService(DatabaseContext db)
{
    private readonly DatabaseContext db = db;

    public async Task<List<Card>> GetCards(string columnId)
    {
        var cards = db.Cards.Where(card => card.ColumnId == columnId);

        Console.WriteLine(cards);

        return cards.ToList();
    }

    public async Task CreateCard(string columnId, string content)
    {
        var column = db.Columns.Where(column => column.Id == columnId).Single();

        var card = new Card
        {
            Id = Guid.NewGuid().ToString(),
            Content = content,
            Column = column,
            ColumnId = column.Id,
        };

        column.Cards.Add(card);

        await db.Cards.AddAsync(card);
        await db.SaveChangesAsync();
    }
}
