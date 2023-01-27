// ==========================================================================
//  Open Notifications
// ==========================================================================
//  Copyright (c) Open Notifications
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

namespace OpenNotifications;

/// <summary>
/// Provides access to the individual clients.
/// </summary>
public interface IOpenNotificationsClient
{
    /// <summary>
    /// Provides the client to deal with providers.
    /// </summary>
    IProvidersClient Providers { get; }

    /// <summary>
    /// Gets the name of the client.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// Generates a HTTP client for direct access to the service.
    /// </summary>
    /// <returns>
    /// The created HTTP client.
    /// </returns>
    HttpClient CreateHttpClient();
}
