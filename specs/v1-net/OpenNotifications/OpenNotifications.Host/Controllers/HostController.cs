using Microsoft.AspNetCore.Mvc;
using OpenNotifications.Controllers.Dtos.SendUpdate;
using OpenNotifications.Controllers.Dtos.Store;
using OpenNotifications.Controllers.Dtos.Users;

namespace OpenNotifications.Controllers;

[ApiController]
public class HostController : ControllerBase
{
    [HttpPost("/send_update")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public void SendUpdate([FromBody] SendUpdateRequest request)
    {
        return;
    }

    [HttpPost("/store_get")]
    [Produces(typeof(GetValueResponse))]
    public GetValueResponse GetValue([FromBody] GetValueRequest request)
    {
        return new GetValueResponse();
    }

    [HttpPost("/store_set")]
    [Produces(typeof(GetValueResponse))]
    public SetValueResponse SetValue([FromBody] SetValueRequest request)
    {
        return new SetValueResponse();
    }

    [HttpPost("/store_remove")]
    [Produces(typeof(GetValueResponse))]
    public RemoveValueResponse RemoveValue([FromBody] RemoveValueRequest request)
    {
        return new RemoveValueResponse();
    }

    [HttpPost("/user_get")]
    [Produces(typeof(GetValueResponse))]
    public GetUserResponse GetUser([FromBody] GetUserRequest request)
    {
        return new GetUserResponse();
    }

    [HttpPost("/user_set")]
    [Produces(typeof(GetValueResponse))]
    public SetUserResponse SetValue([FromBody] SetUserRequest request)
    {
        return new SetUserResponse();
    }
}