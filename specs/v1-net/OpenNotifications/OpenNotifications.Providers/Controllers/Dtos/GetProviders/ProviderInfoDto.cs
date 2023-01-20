using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.GetProviders;

public class ProviderInfoDto
{
    [Required]
    public string DisplayName { get; set; }

    [Required]
    public Dictionary<string, string> Description { get; set; }

    [Required]
    public ProviderInfoLogoDto Logo { get; set; }

    [Required]
    public ProviderType Type { get; set; }

    [Required]
    public Dictionary<string, PropertyInfoDto> Properties { get; set; }

    public Dictionary<string, PropertyInfoDto>? UserProperties { get; set; }
}
