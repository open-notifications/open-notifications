using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos;

public class ErrorDto
{
    [Required]
    public string Description { get; set; }

    [Required]
    public string Code { get; set; }

    public string? RequestField { get; set; }
}
