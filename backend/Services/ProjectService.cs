using backend.Database;
using backend.Database.Models;

namespace backend.Services;

public class ProjectService(DatabaseContext db)
{
    private readonly DatabaseContext db = db;

    public async Task<List<Project>> GetProjects(string UserId)
    {
        return db.Projects.Where(project => project.OwnerId == UserId).ToList();
    }

    public async Task CreateProject(string name, string ownerId)
    {
        var project = new Project
        {
            Id = Guid.NewGuid().ToString(),
            OwnerId = ownerId,
            Name = name,
        };

        await db.Projects.AddAsync(project);
        await db.SaveChangesAsync();
    }
}
