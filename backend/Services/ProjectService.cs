using backend.Database;
using backend.Database.Models;

namespace backend.Services;

public class ProjectService(DatabaseContext db)
{
    private readonly DatabaseContext db = db;

    public async Task<List<Project>> GetProjectsAsync(string UserId)
    {
        return db.Projects.Where(project => project.OwnerId == UserId).ToList();
    }
}
