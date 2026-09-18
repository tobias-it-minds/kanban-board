using System.Text;
using backend.Database;
using backend.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

const string firebaseProjectId = "it-minds-1ade8";
FirebaseApp.Create(new AppOptions()
{
    Credential = CredentialFactory.FromFile<ServiceAccountCredential>("./firebase-private-key.json").ToGoogleCredential(),
    ProjectId = firebaseProjectId,
});


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

string? dbHost = Environment.GetEnvironmentVariable("POSTGRES_HOST");
string? dbPort = Environment.GetEnvironmentVariable("POSTGRES_PORT");
string? dbPassword = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

string connectionString = $@"
    Host={dbHost};
    Port={dbPort};
    Username=postgres;
    Password={dbPassword};
    Database=kanban-database";

builder.Services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddScoped<ProjectService>();
builder.Services.AddScoped<ColumnService>();
builder.Services.AddScoped<CardService>();

builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
                    {
                        policy.AllowAnyOrigin() // TODO: use specific origin
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                    });
        });

builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = $"https://securetoken.google.com/{firebaseProjectId}";
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = $"https://securetoken.google.com/{firebaseProjectId}",
                ValidAudience = firebaseProjectId,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key"))
            };
        });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
// app.UseAuthorization();

app.MapGroup("/project")
    .MapProjectEndpoint();

app.MapGroup("/projects")
    // .RequireAuthorization()
    .MapProjectsEndpoint()
        .MapGroup("{projectId}/columns")
        .MapColumnEndpoint()
            .MapGroup("{columnId}/cards")
            .MapCardEndpoint();

app.Run();
