using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos;

public abstract class BaseRequest
{
    [Required]
    public RequestContextDto Context { get; set; }
}
