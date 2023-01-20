using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class SendRequest : BaseRequest
{
    [Required]
    public string Provider { get; set; }

    [Required]
    public SendUserDto User { get; set; }

    [Required]
    public MessageDto Payload { get; set; }

    [Required]
    public string NotificationId { get; set; }

    [Required]
    public string TrackingToken { get; set; }

    [Required]
    public string TrackingWebhookUrl { get; set; }
}
