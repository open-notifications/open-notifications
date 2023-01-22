using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class MobilePushMessageDto
{
    [Required]
    public string Token { get; set; }

    public Dictionary<string, string>? Data { get; set; }

    public MobilePushAndroidDto? Android { get; set; }

    public MobilePushApnsDto? Apns { get; set; }
}
