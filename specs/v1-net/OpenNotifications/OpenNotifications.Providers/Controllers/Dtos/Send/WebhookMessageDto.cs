using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class WebhookMessageDto : MessageDto
{
    [Required]
    public string Url { get; set; }

    [Required]
    public WebhookMethod Method { get; set; }

    public Dictionary<string, string>? Headers { get; set; }

    public string? Body { get; set; }
}
