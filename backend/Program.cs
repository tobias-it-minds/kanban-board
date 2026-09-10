using backend.Database;
using backend.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.EntityFrameworkCore;

FirebaseApp.Create(new AppOptions()
{
    Credential = CredentialFactory.FromFile<ServiceAccountCredential>("./firebase-private-key.json").ToGoogleCredential(),
    ProjectId = "197668053186",
});

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

string connectionString = $@"
    Host={Environment.GetEnvironmentVariable("POSTGRES_HOST")};
    Port={Environment.GetEnvironmentVariable("POSTGRES_PORT")};
    Username=postgres;
    Password={Environment.GetEnvironmentVariable("POSTGRES_PASSWORD")};
    Database=kanban-database";

builder.Services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddScoped<ProjectService>();

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

app.MapGroup("/projects")
    .MapProjectsEndpoint();

app.Run();
