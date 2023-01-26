// ==========================================================================
//  Open Notifications
// ==========================================================================
//  Copyright (c) Open Notifications
//  All rights reserved. Licensed under the MIT license.
// ==========================================================================

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace OpenNotifications;

public class HttpClientTests
{
    [Fact]
    public void Should_provide_different_clients_by_name()
    {
        var clients =
            new ServiceCollection()
                .AddOpenNotifications("Instance1", new Uri("http://instance1.com")).Services
                .AddOpenNotifications("Instance2", new Uri("http://instance2.com")).Services
                .BuildServiceProvider()
                .GetRequiredService<IEnumerable<IOpenNotificationsClient>>().ToList();

        Assert.Equal(2, clients.Count);

        var httpClient1 = clients[0].CreateHttpClient();
        var httpClient2 = clients[1].CreateHttpClient();

        Assert.Equal(new Uri("http://instance1.com"), httpClient1.BaseAddress);
        Assert.Equal(new Uri("http://instance2.com"), httpClient2.BaseAddress);
    }

    [Fact]
    public void Should_not_register_multiple_instances_with_same_name()
    {
        var clients =
            new ServiceCollection()
                .AddOpenNotifications("shared", new Uri("http://instance1.com")).Services
                .AddOpenNotifications("shared", new Uri("http://instance1.com")).Services
                .BuildServiceProvider()
                .GetRequiredService<IEnumerable<IOpenNotificationsClient>>().ToList();

        Assert.Single(clients);
    }
}
