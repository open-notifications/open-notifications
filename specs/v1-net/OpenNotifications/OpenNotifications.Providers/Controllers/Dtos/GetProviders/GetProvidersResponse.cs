using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos.GetProviders;

public class GetProvidersResponse
{
    [Required]
    public Dictionary<string, ProviderInfoDto> Providers { get; set; }
}
