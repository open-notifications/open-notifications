using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Send;

public class SendUserDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public Dictionary<string, string> Properties { get; set; }
}