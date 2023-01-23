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
import querystring from 'node:querystring';
import { Provider } from '../interface';
import * as twilio from 'twilio';
import { MessageStatus } from 'twilio/lib/rest/api/v2010/account/message';

export class TwilioSmsProvider implements Provider {
  name = 'twilio-sms';

  spec: ProviderInfoDto = {
    displayName: 'Messagebird SMS',
    description: {
      en: 'Send SMS over Messagebird',
    },
    type: ProviderType.SMS,
    properties: {
      accountSid: {
        type: PropertyType.SECRET,
        displayName: {
          en: 'Account SID',
        },
        description: {
          en: 'Your Account SID from www.twilio.com/console.',
        },
        required: true,
      },
      authToken: {
        type: PropertyType.SECRET,
        displayName: {
          en: 'AUTH Token',
        },
        description: {
          en: 'Your Account SID from www.twilio.com/console.',
        },
        required: true,
      },
      from: {
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
      accountSid,
      authToken,
      from,
    }: {
      accountSid: string;
      authToken: string;
      from: string;
    } = request.properties as any;

    const { to, body } = request.payload;

    const twilioInstance = twilio(accountSid, authToken);

    const result = await twilioInstance.messages.create({
      from,
      to,
      body,
      statusCallback: request.trackingWebhookUrl,
    });

    const status = result.status;

    return NotificationStatusDto.status(parseStatus(status));
  }

  async handleWebhook(request: WebhookRequestDto) {
    const response = new WebhookResponseDto();

    if (!request.body) {
      return response;
    }

    const form = querystring.parse(request.body);

    const status = form['MessageStatus'];

    if (!status) {
      return response;
    }

    response.status = NotificationStatusDto.status(parseStatus(status as any));
    return response;
  }
}

function parseStatus(status: MessageStatus) {
  switch (status) {
    case 'delivered':
      return NotificationStatus.DELIVERED;
    case 'sent':
      return NotificationStatus.SENT;
    case 'queued':
    case 'scheduled':
      return NotificationStatus.PENDING;
    default:
      return NotificationStatus.FAILED;
  }
}
