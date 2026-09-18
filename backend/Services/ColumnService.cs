using backend.Database;
using backend.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ColumnService(DatabaseContext db)
{
    private readonly DatabaseContext db = db;

    public async Task<List<Column>> GetColumns(string projectId)
    {
        var columns = db.Columns
            .Where(column => column.ProjectId == projectId)
            .OrderBy(column => column.OrderNr)
            .Include(columns => columns.Cards);

        return columns.ToList();
    }

    public async Task CreateColumn(string projectId, string name)
    {
        var project = db.Projects.Where(project => project.Id == projectId).Single();
        var columns = db.Columns.Where(columns => columns.ProjectId == project.Id);

        var column = new Column
        {
            ProjectId = project.Id,
            Id = Guid.NewGuid().ToString(),
            Name = name,
            OrderNr = columns.Count() + 1,
        };

        project.Columns.Add(column);

        await db.Columns.AddAsync(column);
        await db.SaveChangesAsync();
    }
}
