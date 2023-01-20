using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.Users;

public class GetUserRequest
{
    [Required]
    public string TenantId { get; set; }

    public string? Id { get; set; }

    public string? PropertyName { get; set; }

    public string? PropertyValue { get; set; }
}
