using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.SendUpdate;

public class SendUpdateRequest
{
    [Required]
    public NotificationStatusDto NotificationStatus { get; set; }
}
