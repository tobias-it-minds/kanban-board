using System.Net;
using System.Text.Json;
using backend.Services;
using FirebaseAdmin.Auth;

public static class ProjectsEndpoint
{
    public static RouteGroupBuilder MapProjectsEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (HttpRequest request, ProjectService projectService) =>
        {
            var authHeader = request.Headers.Authorization;
            var idToken = authHeader.ToString().Split(" ")[1];
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);


            var projects = projectService.GetProjects(decodedToken.Uid);

            return JsonSerializer.Serialize(projects);
        });

        group.MapPost("/{projectName}", async (HttpRequest request, string projectName, ProjectService projectService) =>
        {
            try
            {
                var authHeader = request.Headers.Authorization;
                var idToken = authHeader.ToString().Split(" ")[1];
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                await projectService.CreateProject(projectName, decodedToken.Uid);

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
