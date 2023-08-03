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
import { IntegrationProvider } from '../interface';
import * as twilio from 'twilio';
import { MessageStatus } from 'twilio/lib/rest/api/v2010/account/message';
import { appendQuery } from '../utils';

export class TwilioSmsProvider implements IntegrationProvider {
  name = 'twilio-sms';

  spec: ProviderInfoDto = {
    displayName: 'Twilio',
    description: {
      en: 'Send SMS over Twilio',
    },
    type: ProviderType.SMS,
    logoSvg:
      "<svg fill='#F22F46' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 30'><path d='M14.4 11.3c0 1.7-1.4 3.1-3.1 3.1S8.2 13 8.2 11.3s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1zm-3.1 4.3c-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.1-1.4 3.1-3.1-1.4-3.1-3.1-3.1zM30 15c0 8.3-6.7 15-15 15S0 23.3 0 15 6.7 0 15 0s15 6.7 15 15zm-4 0c0-6.1-4.9-11-11-11S4 8.9 4 15s4.9 11 11 11 11-4.9 11-11zm-7.3.6c-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.1-1.4 3.1-3.1-1.4-3.1-3.1-3.1zm0-7.4c-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.1-1.4 3.1-3.1-1.4-3.1-3.1-3.1zm51.6-2.3c.1 0 .2.1.3.2v3.2c0 .2-.2.3-.3.3H65c-.2 0-.3-.2-.3-.3V6.2c0-.2.2-.3.3-.3h5.3zm-.1 4.5H60c-.1 0-.3.1-.3.3l-1.3 5-.1.3-1.6-5.3c0-.1-.2-.3-.3-.3h-4c-.1 0-.3.1-.3.3l-1.5 5-.1.3-.1-.3-.6-2.5-.6-2.5c0-.1-.2-.3-.3-.3h-8V6.1c0-.1-.2-.3-.4-.2l-5 1.6c-.2 0-.3.1-.3.3v2.7h-1.3c-.1 0-.3.1-.3.3v3.8c0 .1.1.3.3.3h1.3v4.7c0 3.3 1.8 4.8 5.1 4.8 1.4 0 2.7-.3 3.6-.8v-4c0-.2-.2-.3-.3-.2-.5.2-1 .3-1.4.3-.9 0-1.4-.4-1.4-1.4v-3.4h2.9c.1 0 .3-.1.3-.3v-3.2L47.8 24c0 .1.2.3.3.3h4.2c.1 0 .3-.1.3-.3l1.8-5.6.9 2.9.8 2.7c0 .1.2.3.3.3h4.2c.1 0 .3-.1.3-.3l3.8-12.6V24c0 .1.1.3.3.3h5.1c.1 0 .3-.1.3-.3V10.7c0-.1-.1-.3-.2-.3zm6.7-4.5h-5.1c-.1 0-.3.1-.3.3v17.7c0 .1.1.3.3.3h5.1c.1 0 .3-.1.3-.3V6.1c0-.1-.1-.2-.3-.2zm6.8 0h-5.3c-.1 0-.3.1-.3.3v3.1c0 .1.1.3.3.3h5.3c.1 0 .3-.1.3-.3V6.1c0-.1-.1-.2-.3-.2zm-.1 4.5h-5.1c-.1 0-.3.1-.3.3v13.1c0 .1.1.3.3.3h5.1c.1 0 .3-.1.3-.3V10.7c0-.1-.1-.3-.3-.3zm16.1 6.8c0 3.8-3.2 7.1-7.7 7.1-4.4 0-7.6-3.3-7.6-7.1s3.2-7.1 7.7-7.1c4.4 0 7.6 3.3 7.6 7.1zm-5.4.1c0-1.4-1-2.5-2.2-2.4-1.3 0-2.2 1.1-2.2 2.4s1 2.4 2.2 2.4c1.3 0 2.2-1.1 2.2-2.4z'/></svg>",
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
        summary: true,
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
      statusCallback: appendQuery(
        request.trackingWebhookUrl,
        'token',
        request.trackingToken,
      ),
    });

    const status = result.status;

    return NotificationStatusDto.status(
      parseStatus(status),
      request.trackingToken,
    );
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

    const token = request.query['token']?.[0];

    if (!token) {
      return response;
    }

    response.status = NotificationStatusDto.status(
      parseStatus(status as any),
      token,
    );
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
