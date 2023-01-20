using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos;

public class UserDto
{
    [Required]
    public string Id { get; set; }

    [Required]
    public Dictionary<string, string> Properties { get; set; }
}