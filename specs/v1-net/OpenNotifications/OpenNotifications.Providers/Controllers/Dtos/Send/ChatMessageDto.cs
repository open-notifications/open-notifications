using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class ChatMessageDto
{
    [Required]
    public string WebhookUrl { get; set; }

    [Required]
    public string Content { get; set; }
}
