# Open Notifications

## Introduction

### Goal

The goal of this repository is to propose a standard or specification for notification **providers**. A notification providers is every service that can send a message to a user or group. We call the different kind of messages **channel**.

* SMS
* Email
* Mobile Push
* Web Push
* Chats (Teams, Slack ...)
* Messaging (Facebook, Whatsapp, Telegram, Threema, Signal)
* Webhooks

### Example Provider

This document uses telegram as an example provider, because it has the most complicated use case:

1. Developer registers a bot in telegram.
2. Developer registers a provider using the bot name and secret.
3. Provider registers the webook.
4. End user contacts the bot.
5. Provider has to answer with a welcome message (need to be stored somewhere).
6. Provider checks whether the user is known and stores the chat_id for the user.
7. Provider sends the notification using the chat id from the user.

### General architecture

The architecture is very simple:

1. The **provider service** implements one or many providers and receives notifications to be sent to a specific provider.
2. The **host service** (e.g. notifo or novu) is creating notifications and forwards them to a provider service.

### Requirements

The specification is built based on the following requirements and assumptions:

* Each channel has a unique payload.
* Provider services should be stateless, if possible.
* Provider services can implement multiple providers.
* Provider services expose information about the implemented providers.
* Provider services must not be exposed to the public internet.
* All state is provided by the host service.
* Communication is over http using OpenAPI to make the implementation of a provider service as easy as possible.

## General

The specification is based on examples for now. Later an OpenAPI specification will follow.

### Context

Each request has a context field, that contains information that are necessary for the general workflow.

The request from the host to the provider service has the following signature:

```
{
    "context": {
        "hostUrl": "https://",
        "authHeaders": {
            "ApiKey": "KEY"
        },
        "trusted": true,
        "tenantId": "...",
        "userId": "...",
    },
    "payload": {
        ...
    }
}
```

Due to limitations, such as header length, we do not store these information in the headers. Therefore all calls are POST request

With each request, the host sends the current URL and the authentication headers to the provider service. The provider service can use these information to call the host.

Furthermore a tenant ID is provided here (more about this later).

### Trusted Provider Services

Notifo and Novu use a multi-tenant approach. Therefore the provider would receive credentials for multiple tenants. This can cause functional or even security issues, because a provider could just store all credentials and call an API with the wrong credentials. Either by purpose or by accident. The set of API methods is very restricted, but it is still a risk that needs to be handled. Therefore the host service should manage a list of trusted services and only expose the API key to these provider services.

### OTLP

Provider services should support the open telemetry protocol.

## Endpoints

### POST /get_providers

Because provider services can implement multiple providers, this endpoint is used to expose all implemented providers.

```
POST /get_providers
{
    "context": {
        ...
    },
    "payload": null
}

// Returns
{
    "telegram": {
        "name": "Telegram Integration",
        "logo": {
            // Either SVG or Raster Image (PNG, JPEG, WEBP, AVG).
            "svg": "...",
            "raster": "base64 encoded
        },
        "description": { 
            "en": "Access Key",
        },
        "type": "Messaging,
        "properties": {
            "accessKey": {
                "type": "string",
                "name": { 
                    "en": "Access Key",
                },
                "required": true
            }
        },
        "userProperties": {
            "telegramUsername": {
                "type": "string",
                "name": { 
                    "en": "Telegram Username",
                },
                "required": true
            },
            "telegramChatId": {
                "type": "string",
                "name": { 
                    "en": "Telegram ChatID",
                },
                "required": false
            }
        },
        "errors": {
            "FOOBAR": "12323"
        }
    } 
}

```

The provider provides...

* The unique name within the service.
* The display name, description and logo.
* The channel type that is implemented.
* The fields that are needed to configure the provider.
* The user properties that are needed for the provider to work properly.
* A list of error messages that are used by the provider with error code and description (tbd).

> It is up to the host service to encrypt passwords and settings in general. The provider service does not expose whether a field is a secret, because it is easy to forget that and it should be the responsibility of the hot service and not the provider service to store values properly.

## POST /verify_provider

Used the verify the settings:

```
POST /verify_provider
{
    "context": {

    },
    "payload": {
        "provider": "telegram",
        "properties": {
            "Key": "Value"
        }
    }
}

// Returns (Status Code: tbd)
{
    "result": "Invalid",
    "errors": {
        "Key": "..."
    }
}
```

The provider should make a dummy call to the service to verify that the credentials are correct.

## POST /install  and POST /uninstall

This endpoint is called when the provider is configured in the host application. This can be used to install webhooks (which is needed for telegram).

```
/POST /install
{
    "context": {

    },
    "payload": {
        "provider": "telegram",
        "properties": {
            "Key": "Value"
        },
        "webhookUrl": "..."
    }
}

// Returns 204
```

```
/POST /uninstall
{
    "context": {

    },
    "payload": {
        "provider": "telegram",
        "properties": {
            "Key": "Value"
        },
        "webhookUrl": "..."
    }
}

// Returns 204
```

### POST /send

This is main endpoint to send messages to a provider.

```
POST /send
{
    "context": {

    },
    "payload": {
        "provider": "telegram",
        "user": {
            "properties": {
                // The user properties from GET /providers
            }
        },
        "messaging": {
            "type": "Messaging" // discriminator,
            "message": "Hello World"
        },
        "notificationId": "...",
        "trackingToken": "...",
        "webhookUrl": "..."
    }
}

// Returns
{
    "status": "Sent | Delivered | Failed",
    "errors": [{
        "code": INVALID_CHAT_ID",
        "description": "The chat id is not valid"
    }]
}
```

The difference between delivered and sent is the answer from the actual provider. For example when you send an SMS you typically get a sent answer immediately and the delivered response via webhook later.

### POST /webhook

This endpoint handles a webhook response. Therefore the provider service must not be exposed to the internet. The response of the request is meant for the provider, not for the host application.

```
POST /webhook
{
    "context": {

    },
    "payload": {
        "request": {
            "query": {
                "Key": ["Value"]
            },
            "headers": {
                "Key": "Value"
            },
            "body": "STRING ENCODED BODY"
        },
        "notificationId": "..."
    }
}

// Returns
{
    "statusCode": 200,
    "headers": {
        "Key": "Value"
    },
    "body": "STRING ENCODED BODY"
}
```

## Host endpoints

The communication with the provider is a two way communication. For example the provider has to send delivery information back to the host, there are multiple considerations:

1. The webhook response could return the status directly, but this would limit the use case on http calls and webhook and do not allow other protocols that are not directly managed by the host application.

2. We could use OpenAPI callbacks or webhooks for that, but they are very knew and not widely supported yet.

Therefore the host providers its own OpenAPI specification that can be invoked by the provider service. The host URL and access keys are provided in each call.

### POST /send_update

Updates the status of a notification

```
POST /send_update
{
    "trackingToken": "...",
    "result": {
        "status": "Sent | Delivered | Failed",
        "errors": [{
            "code": INVALID_CHAT_ID",
            "description": "The chat id is not valid"
        }]
    }
}
```

### Trusted: POST /get_users and POST /update_users/{id}

Provides a user by a provider property or prebuilt property:

* email
* phone_number
* id

```
POST /get_user
{
    "provider: "telegram",
    "propertyName": "username",
    "propertyValue:" "John_Doe",
    "tenantId": "..."
}

// Returns
{
    "context": {

    },
    "payload": {
        "user": {
            "id": "...",
            "properties": {
                "property": "user"
            }
        }
    }
}
```

The provider service can update a user property

```
POST /users
{
    "provider": telegram",
    "tenantId": "...",
    "userId": "444",
    "properties": {
        "chat_id": "123123"
    }
}
```

// Status: 204 (tbd)

### Trusted: POST /get_value and POST /store_value/{key}

The provider host provides a simple key-value store. The goal is that the provider service can be stateless. This is not possible in all cases, though. When the provider service uses an messaging telemetry like MQTT, he has to maintain a stable connection with the provider itself. Then there is no entry point for the host service to provide the credentials.

It has been considered to add a registration process to the host service. The provider service would register itself at the host and provide the current URL. If the URL is a registered provider service, the host service would send the credentials to this URL. Unfortunately this does not work with a load balancer.

```
POST /get_value
{
    "tenantId": "...",
    "key": "My-Key",
    "scope": "Tenant | User"
}

// returns
{
    "context": {
    },
    "payload": {
        "value": "..."
    }
}
```

```
POST /store_value
{
    "tenantId": "...",
    "key": "My-Key",
    "value": "Update",
    "replace": false,
    "scope": "Tenant | User"
}

// returns
{
    "context": {
    },
    "payload": {
        "value": "..."
    }
}
```