using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class EmailMessageDto : MessageDto
{
    [Required]
    public string[] To { get; set; }

    [Required]
    public string Subject { get; set; }

    [Required]
    public string FromEmail { get; set; }

    public string? FromName { get; set; }

    public string BodyText { get; set; }

    public string BodyEmail { get; set; }

    public string[]? CC { get; set; }

    public string[]? BC { get; set; }
}
