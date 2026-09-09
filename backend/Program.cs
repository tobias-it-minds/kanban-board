using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Npgsql;

// await using var connection = new NpgsqlConnection(connectionString);
// await connection.OpenAsync();

FirebaseApp.Create(new AppOptions()
{
    Credential = CredentialFactory.FromFile<ServiceAccountCredential>("./firebase-private-key.json").ToGoogleCredential(),
    ProjectId = "197668053186",
});

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/weatherforecast", () =>
{
    return "<h1> test </h1>";
})
.WithName("GetWeatherForecast");

app.Run();
