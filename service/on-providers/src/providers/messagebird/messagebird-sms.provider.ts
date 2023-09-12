import {
  ProviderInfoDto,
  SendSmsRequestDto,
  ProviderType,
  PropertyType,
  NotificationStatus,
  WebhookRequestDto,
  NotificationStatusDto,
} from 'src/dtos';
import { IntegrationProvider } from '../interface';
import {
  initClient,
  Message,
  MessageBird,
  MessageParameters,
} from 'messagebird';

export class MessageBirdSmsProvider implements IntegrationProvider {
  private readonly spec: ProviderInfoDto = {
    displayName: 'Messagebird',
    description: {
      en: 'Send SMS over Messagebird',
    },
    type: ProviderType.SMS,
    logoSvg:
      "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 66 55' fill='#fff' fill-rule='evenodd' stroke='#000' stroke-linecap='round' stroke-linejoin='round'><path d='M57.425 9.57c-2.568 0-4.863 1.284-6.264 3.23l-9.454 13.228a1.9 1.9 0 0 1-1.556.817 1.91 1.91 0 0 1-1.906-1.906c0-.39.117-.778.31-1.05l7.975-11.945c.817-1.206 1.284-2.684 1.284-4.28C47.814 3.424 44.39 0 40.15 0H0v7.664h34.393c0 2.1-1.712 3.852-3.852 3.852H0c0 2.723.584 5.33 1.595 7.664H26.69c0 2.1-1.712 3.852-3.852 3.852H3.852a19.12 19.12 0 0 0 15.368 7.664h9.454a1.91 1.91 0 0 1 1.906 1.906 1.91 1.91 0 0 1-1.906 1.906H19.18L6.34 53.688h23.227c10.62 0 19.647-6.925 22.8-16.496l4.32-13.11c1.4-4.24 3.968-7.976 7.314-10.816-1.323-2.218-3.774-3.696-6.575-3.696zm0 5.252c-.778 0-1.44-.66-1.44-1.44a1.46 1.46 0 0 1 1.44-1.44 1.46 1.46 0 0 1 1.44 1.44c0 .817-.66 1.44-1.44 1.44z' stroke='none' fill='#2481d7'/></svg>",
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
        summary: true,
      },
    },
  };

  name = 'messagebird-sms';

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

    const { to, body } = request.payload;

    const messagebird = initClient(accessKey);

    const result = await sendAsync(messagebird, {
      originator,
      recipients: [to],
      body,
      reportUrl: request.trackingWebhookUrl,
      reference: request.trackingToken,
    });

    const status = result.recipients.items[0].status;

    return NotificationStatusDto.status(
      parseStatus(status),
      request.trackingToken,
    );
  }

  async handleWebhook(request: WebhookRequestDto) {
    const status = request.query['status']?.[0];
    if (!status) {
      return {};
    }

    const reference = request.query['reference']?.[0];
    if (!reference) {
      return {};
    }

    const statuses = [
      NotificationStatusDto.status(parseStatus(status), reference),
    ];

    return { statuses };
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
