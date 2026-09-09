using Npgsql;

string host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
string port = Environment.GetEnvironmentVariable("POSTGRES_PORT");
string password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
string connectionString = $"Host={host};Port={port};Username=postgres;Password={password};Database=kanban-database";
await using var connection = new NpgsqlConnection(connectionString);
await connection.OpenAsync();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// builder.Services.AddAuthentication().AddGoogleOpenIdConnect(googleOptions =>
// {
//     googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//     googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
// });

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
