namespace OpenNotifications.Controllers.Dtos.Send;

public class MobilePushApnsDto
{
    public string? Title { get; set; }

    public string? TitleLocKey { get; set; }

    public string[]? TitleLocArgs { get; set; }

    public string? Subtitle { get; set; }

    public string? SubtitleLocKey { get; set; }

    public string[]? SubtitleLocArgs { get; set; }

    public string? Body { get; set; }

    public string? LocKey { get; set; }

    public string[]? LocArgs { get; set; }

    public bool MutableContent { get; set; }

    public Dictionary<string, string?> Headers { get; set; }
}