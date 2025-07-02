using System.ComponentModel.DataAnnotations;

namespace azure_app_server.Models;

public class Expense
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    [StringLength(50)]
    public string Category { get; set; } = string.Empty;
} 