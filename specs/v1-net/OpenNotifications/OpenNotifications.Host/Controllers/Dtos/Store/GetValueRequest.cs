using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Store;

public class GetValueRequest
{
    [Required]
    public string Key { get; set; }

    public string? TenantId { get; set; }

    public string? UserId { get; set; }
}
