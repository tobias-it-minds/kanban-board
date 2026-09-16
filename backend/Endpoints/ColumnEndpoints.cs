using backend.Services;
using FirebaseAdmin.Auth;
using Newtonsoft.Json;

public static class ColumnEndpoints
{
    public static RouteGroupBuilder MapColumnEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (HttpRequest request, string projectId, ColumnService columnService) =>
        {
            var authHeader = request.Headers.Authorization;
            var idToken = authHeader.ToString().Split(" ")[1];
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

            var columns = await columnService.GetColumns(projectId);

            var jsonColumns = JsonConvert.SerializeObject(columns, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });

            Console.WriteLine($"Get Columns: {jsonColumns}");

            return jsonColumns;
        });

        group.MapPost("/{columnName}", async (HttpRequest request, string projectId, string columnName, ColumnService columnService) =>
        {
            try
            {
                var authHeader = request.Headers.Authorization;
                var idToken = authHeader.ToString().Split(" ")[1];
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                await columnService.CreateColumn(projectId, columnName);

                Console.WriteLine($"Added column '{columnName}' to project '{projectId}'");

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
