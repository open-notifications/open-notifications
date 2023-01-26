using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Store;

public class SetValueRequest
{
    [Required]
    public string Key { get; set; }

    [Required]
    public string Value { get; set; }

    public string? TenantId { get; set; }

    public string? UserId { get; set; }

    public bool IfNotExists { get; set; }
}
