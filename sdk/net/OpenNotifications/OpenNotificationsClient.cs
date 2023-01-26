// ==========================================================================
//  Open Notifications
// ==========================================================================
//  Copyright (c) Open Notifications
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

namespace OpenNotifications;

internal sealed class OpenNotificationsClient : IOpenNotificationsClient
{
    private readonly ProvidersClient providers;
    private readonly Func<HttpClient> factory;

    public IProvidersClient Providers => providers;

    public OpenNotificationsClient(string name, IHttpClientFactory httpClientFactory)
    {
        factory = () => httpClientFactory.CreateClient(name);

        providers = new ProvidersClient(factory);
    }

    public HttpClient CreateHttpClient()
    {
        return factory();
    }
}
