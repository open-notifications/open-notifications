using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos;

public sealed class NotificationStatusDto
{
    [Required]
    public NotificationStatus Status { get; set; }

    [Required]
    public string NotificationId { get; set; }

    public ErrorDto[]? Errors { get; set; }
}
