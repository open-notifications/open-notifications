using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Webhook;

public class WebhookRequest
{

    [Required]
    public Dictionary<string, string[]> Query { get; set; }

    [Required]
    public Dictionary<string, string> Headers { get; set; }

    public string? Body { get; set; }
}
