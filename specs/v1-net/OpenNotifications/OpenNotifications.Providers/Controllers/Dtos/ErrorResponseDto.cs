using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos;

public class ErrorsDto
{
    [Required]
    public ErrorDto[] Errors { get; set; }
}
