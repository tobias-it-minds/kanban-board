using backend.Services;
using FirebaseAdmin.Auth;

public static class Projects
{
    public static RouteGroupBuilder MapProjectsEndpoint(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (string UserId, string IdToken, ProjectService projectService) =>
        {
            Console.WriteLine("UserId: " + UserId);
            Console.WriteLine("IdToken: " + IdToken);

            FirebaseToken decodedToken;
            decodedToken = await FirebaseAuth.DefaultInstance
                .VerifyIdTokenAsync(IdToken);

            string uid = decodedToken.Uid;
            var claims = decodedToken.Claims;

            return await projectService.GetProjectsAsync(UserId);
        });

        return group;
    }
}
