# Open Notifications

The goal of this project is to provide a specification for services (providers) to send notification through the following challenges: 

* Chats (Teams, Slack ...) (v2)
* Email (v1)
* Messaging (Facebook, Whatsapp, Telegram, Threema, Signal) (v2)
* Mobile Push (v2)
* SMS (v1)
* Web Push (v2)
* Webhooks (v2)

This specification can be used by the following groups:

* If you provide a service to send notifications you can implement this specification to make your service easy to use for other developers.
* If you build a notification aggregator or an integrated notification solution you can connect to one or multiple providers to send notification messages to your users.

This repository provides:

1. The specification as OpenAPI document.
2. The default implementation of the provider service with builtin integrations for the big players on the market built with Node and NestJS.
3. SDKs for multiple programming languages, usually auto-generated from the OpenAPI specification.
