namespace OpenNotifications.Controllers.Dtos.Send;

public class MobilePushAndroidDto
{
    public Dictionary<string, string>? Data { get; set; }

    public string CollapseKey { get; set; }

    public string RestrictedPackageName { get; set; }

    public MobilePushAndroidPriority? Priority { get; set; }

    public int? TimeToLiveInSeconds { get; set; }
}