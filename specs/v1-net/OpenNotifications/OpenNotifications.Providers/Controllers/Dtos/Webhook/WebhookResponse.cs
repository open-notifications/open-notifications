namespace OpenNotifications.Controllers.Dtos.Webhook;

public class WebhookResponse
{
    public WebhookHttpResponseDto? Http { get; set; }

    public NotificationStatusDto? NotificationStatus { get; set; }
}
