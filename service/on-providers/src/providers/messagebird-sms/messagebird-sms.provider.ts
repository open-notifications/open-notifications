import {
  ProviderInfoDto,
  SendSmsRequestDto,
  ProviderType,
  PropertyType,
  NotificationStatus,
  WebhookRequestDto,
  WebhookResponseDto,
  NotificationStatusDto,
} from 'src/dtos';
import { Provider } from '../interface';
import initMB, { Message, MessageBird, MessageParameters } from 'messagebird';

export class MessageBirdSmsProvider implements Provider {
  name = 'messagebird-sms';

  spec: ProviderInfoDto = {
    displayName: 'Messagebird SMS',
    description: {
      en: 'Send SMS over Messagebird',
    },
    type: ProviderType.SMS,
    properties: {
      accessKey: {
        type: PropertyType.SECRET,
        displayName: {
          en: 'Access Key',
        },
        description: {
          en: 'The access key.',
        },
        required: true,
      },
      originator: {
        type: PropertyType.STRING,
        displayName: {
          en: 'Originator',
        },
        description: {
          en: 'The phone number to send from.',
        },
        required: true,
      },
    },
  };

  getSpec() {
    return this.spec;
  }

  async sendSms(request: SendSmsRequestDto) {
    const {
      accessKey,
      originator,
    }: {
      accessKey: string;
      originator: string;
    } = request.properties as any;

    const { to, text } = request.payload;

    const messagebird = initMB(accessKey);

    const result = await sendAsync(messagebird, {
      originator,
      recipients: [to],
      body: text,
      reference: request.notificationId,
      reportUrl: request.trackingWebhookUrl,
    });

    const status = result.recipients.items[0].status;

    return NotificationStatusDto.status(parseStatus(status));
  }

  async handleWebhook(request: WebhookRequestDto) {
    const response = new WebhookResponseDto();
    const recipient = request.query['recipient']?.[0];

    if (!recipient) {
      return response;
    }

    const status = request.query['status']?.[0];

    if (!status) {
      return response;
    }

    response.status = NotificationStatusDto.status(
      parseStatus(status),
      recipient,
    );
    return response;
  }
}

function parseStatus(status: string) {
  switch (status) {
    case 'delivered':
      return NotificationStatus.DELIVERED;
    case 'sent':
      return NotificationStatus.SENT;
    case 'buffered':
    case 'scheduled':
      return NotificationStatus.PENDING;
    default:
      return NotificationStatus.FAILED;
  }
}

function sendAsync(
  messagebird: MessageBird,
  messageParams: MessageParameters,
): Promise<Message> {
  return new Promise((resolve, reject) => {
    messagebird.messages.create(messageParams, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}
