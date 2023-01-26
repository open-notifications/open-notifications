using NJsonSchema.Converters;
using System.Text.Json.Serialization;

namespace OpenNotifications.Controllers.Dtos.Send;

[JsonInheritance("Email", typeof(EmailMessageDto))]
[JsonInheritance("Chat", typeof(ChatMessageDto))]
[JsonInheritance("MobilePushMessageDto", typeof(MobilePushMessageDto))]
[JsonInheritance("Sms", typeof(SmsMessageDto))]
[JsonInheritance("Webhook", typeof(WebhookMessageDto))]
[JsonConverter(typeof(JsonInheritanceConverter))]
public abstract class MessageDto
{
}