using System.Net;
using System.Text.Json;
using backend.Services;
using FirebaseAdmin.Auth;

public static class ColumnEndpoints
{
    public static RouteGroupBuilder MapColumnEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (HttpRequest request, string projectId, ColumnService columnService) =>
        {
            var authHeader = request.Headers.Authorization;
            var idToken = authHeader.ToString().Split(" ")[1];
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

            var columns = columnService.GetColumns(projectId);

            return JsonSerializer.Serialize(columns);
        });

        group.MapPost("/{columnName}", async (HttpRequest request, string projectId, string columnName, ColumnService columnService) =>
        {
            try
            {
                var authHeader = request.Headers.Authorization;
                var idToken = authHeader.ToString().Split(" ")[1];
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                await columnService.CreateColumn(projectId, columnName);

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
