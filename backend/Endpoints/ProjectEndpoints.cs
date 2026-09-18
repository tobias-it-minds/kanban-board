using System.Text.Json;
using backend.Services;
using FirebaseAdmin.Auth;

public static class ProjectEndpoint
{
    public static RouteGroupBuilder MapProjectEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/{projectId}", async (HttpRequest request, string projectId, ProjectService projectService) =>
        {
            var authHeader = request.Headers.Authorization;
            var idToken = authHeader.ToString().Split(" ")[1];
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

            var project = await projectService.GetProject(projectId);

            if (project.OwnerId != decodedToken.Uid)
            {
                return "";
            }

            var jsonProjects = JsonSerializer.Serialize(project);

            Console.WriteLine($"Get Projects: {jsonProjects}");

            return jsonProjects;
        });

        group.MapDelete("/{projectId}", async (HttpRequest request, string projectId, ProjectService projectService) =>
        {
            try
            {
                var authHeader = request.Headers.Authorization;
                var idToken = authHeader.ToString().Split(" ")[1];
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                await projectService.DeleteProject(projectId);

                return Results.Ok();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);

                return Results.BadRequest();
            }
        });

        return group;
    }
}
