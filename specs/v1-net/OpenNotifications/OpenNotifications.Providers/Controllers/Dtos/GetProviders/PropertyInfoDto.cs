using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.GetProviders;

public class PropertyInfoDto
{
    [Required]
    public Dictionary<string, string> DisplayName { get; set; }

    [Required]
    public Dictionary<string, string> Description { get; set; }

    [Required]
    public PropertyType Type { get; set; }

    public bool Required { get; set; }

    public int? MinLength { get; set; }

    public int? MaxLength { get; set; }

    public int? MinValue { get; set; }

    public int? MaxValue { get; set; }

    public string? Pattern { get; set; }
}