using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class SmsMessageDto : MessageDto
{
    [Required]
    public string Text { get; set; }

    [Required]
    public string PhoneNumber { get; set; }
}
