using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Users;

public class SetUserRequest
{
    [Required]
    public string TenantId { get; set; }

    [Required]
    public Dictionary<string, string> Updates { get; set; }

    public string? Id { get; set; }

    public string? PropertyName { get; set; }

    public string? PropertyValue { get; set; }
}
