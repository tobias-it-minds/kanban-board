using System.Net;
using System.Text.Json;
using backend.Services;
using FirebaseAdmin.Auth;

public static class CardEndpoints
{
    public static RouteGroupBuilder MapCardEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (HttpRequest request, string projectId, CardService cardService) =>
        {
            var authHeader = request.Headers.Authorization;
            var idToken = authHeader.ToString().Split(" ")[1];
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

            var cards = cardService.GetCards(projectId);

            return JsonSerializer.Serialize(cards);
        });

        group.MapPost("/{content}", async (HttpRequest request, string projectId, string columnId, string content, CardService cardService) =>
        {
            try
            {
                var authHeader = request.Headers.Authorization;
                var idToken = authHeader.ToString().Split(" ")[1];
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);

                await cardService.CreateCard(columnId, content);

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
