namespace OpenNotifications.Controllers.Dtos.Store;

public class SetValueResponse : BaseResponse
{
    public bool HasBeenSet { get; set; }

    public string? PreviousValue { get; set; }
}
