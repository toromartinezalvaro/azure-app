using Microsoft.EntityFrameworkCore;
using azure_app_server.Data;
using azure_app_server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS policy to allow any origin
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Agregar conexión a la base de datos
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Use CORS
app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Azure App Service maneja HTTPS automáticamente, no necesitamos forzar redirección
// app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Endpoint para probar la conexión a la base de datos
app.MapGet("/test-db", async (DatabaseContext db) =>
{
    try
    {
        // Intentar conectar a la base de datos
        await db.Database.CanConnectAsync();
        return Results.Ok(new { message = "Conexión a la base de datos exitosa!", timestamp = DateTime.UtcNow });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al conectar con la base de datos: {ex.Message}");
    }
})
.WithName("TestDatabase");

// Expenses endpoints
// Get all expenses
app.MapGet("/expenses", async (DatabaseContext db) =>
{
    var expenses = await db.Expenses.OrderByDescending(e => e.Date).ToListAsync();
    return Results.Ok(expenses);
}).WithName("GetExpenses");

// Create a new expense
app.MapPost("/expenses", async (Expense expense, DatabaseContext db) =>
{
    // Set the date to now in UTC, ignore any value from the client
    expense.Date = DateTime.UtcNow;

    db.Expenses.Add(expense);
    await db.SaveChangesAsync();
    return Results.Created($"/expenses/{expense.Id}", expense);
}).WithName("CreateExpense");

// Delete an expense by id
app.MapDelete("/expenses/{id:int}", async (int id, DatabaseContext db) =>
{
    var expense = await db.Expenses.FindAsync(id);
    if (expense is null)
        return Results.NotFound();

    db.Expenses.Remove(expense);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).WithName("DeleteExpense");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
