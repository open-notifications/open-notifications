using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Install;

public class InstallationRequest : BaseRequest
{
    [Required]
    public string Provider { get; set; }

    [Required]
    public Dictionary<string, string> Properties { get; set; }

    [Required]
    public string WebhookUrl { get; set; }
}
