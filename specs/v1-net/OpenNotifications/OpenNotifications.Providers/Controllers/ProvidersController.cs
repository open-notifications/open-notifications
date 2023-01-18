using Microsoft.AspNetCore.Mvc;
using OpenNotifications.Controllers.Dtos.GetProviders;
using OpenNotifications.Controllers.Dtos.Install;
using OpenNotifications.Controllers.Dtos.Send;

namespace OpenNotifications.Controllers;

[ApiController]
public class GeneralController : ControllerBase
{
    [HttpPost("/get_providers")]
    [Produces(typeof(GetProvidersResponse))]
    public GetProvidersResponse GetProviders([FromBody] GetProvidersRequest request)
    {
        return new GetProvidersResponse();
    }

    [HttpPost("/install")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public void Install([FromBody] InstallationRequest request)
    {
        return;
    }

    [HttpPost("/uninstall")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public void Uninstall([FromBody] InstallationRequest request)
    {
        return;
    }

    [HttpPost("/send")]
    [Produces(typeof(SendResponse))]
    public SendResponse Send([FromBody] SendRequest request)
    {
        return new SendResponse();
    }
}