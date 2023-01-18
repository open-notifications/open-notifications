using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Webhook;

public class WebhookHttpResponseDto : BaseRequest
{
    [Required]
    public int StatusCode { get; set; }
    
    public Dictionary<string, string>? Headers { get; set; }

    public string? Body { get; set; }
}
