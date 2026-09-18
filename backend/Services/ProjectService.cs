using backend.Database;
using backend.Database.Models;

namespace backend.Services;

public class ProjectService(DatabaseContext db)
{
    private readonly DatabaseContext db = db;

    public async Task DeleteProject(string projectId)
    {
        var project = db.Projects.Where(project => project.Id == projectId).Single();
        db.Projects.Remove(project);
    }

    public async Task<Project> GetProject(string projectId)
    {
        return db.Projects.Where(project => project.Id == projectId).Single();
    }

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
