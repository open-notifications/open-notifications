namespace OpenNotifications.Controllers.Dtos;

public class RequestContextDto
{
    public string HostUrl { get; set; }

    public Dictionary<string, string> AuthHeaders { get; set; }

    public bool Trusted { get; set; }

    public string TenantId { get; set; }

    public string UserId { get; set; }
}
