namespace OpenNotifications.Controllers.Dtos.Store;

public class RemoveValueResponse : BaseResponse
{
    public bool HasBeenDeleted { get; set; }

    public string? PreviousValue { get; set; }
}
