using System.ComponentModel.DataAnnotations;

namespace OpenNotifications.Controllers.Dtos;

public class BaseResponse
{
    [Required]
    public RequestContextDto Context { get; set; }
}
