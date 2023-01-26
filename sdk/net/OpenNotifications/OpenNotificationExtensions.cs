// ==========================================================================
//  Open Notifications
// ==========================================================================
//  Copyright (c) Open Notifications
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using Microsoft.Extensions.DependencyInjection;

namespace OpenNotifications;

/// <summary>
/// Adds the notification client to the service collection.
/// </summary>
public static class OpenNotificationExtensions
{
    private static readonly HashSet<string> Registrations = new HashSet<string>();

    /// <summary>
    /// Adds the notification client to the service collection.
    /// </summary>
    /// <param name="services">The services to configure.</param>
    /// <param name="name">The name of the client.</param>
    /// <param name="url">The base address.</param>
    /// <param name="configureClient">A delegate that is used to configure an <see cref="HttpClient"/>.</param>
    /// <returns>An <see cref="IHttpClientBuilder"/> that can be used to configure the client.</returns>
    public static IHttpClientBuilder AddOpenNotifications(this IServiceCollection services, string name, Uri url, Action<HttpClient>? configureClient = null)
    {
        if (Registrations.Add(name))
        {
            services.AddSingleton<IOpenNotificationsClient>(c => new OpenNotificationsClient(name, c.GetRequiredService<IHttpClientFactory>()));
        }

        return services.AddHttpClient(name, httpClient =>
        {
            httpClient.BaseAddress = url;

            configureClient?.Invoke(httpClient);
        });
    }
}
