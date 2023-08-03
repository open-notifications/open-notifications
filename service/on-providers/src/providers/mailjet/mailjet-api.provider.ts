import { BadRequestException } from '@nestjs/common';
import { Client, LibraryResponse, SendEmailV3_1, Webhook } from 'node-mailjet';
import {
  SendEmailRequestDto,
  NotificationStatusDto,
  WebhookRequestDto,
  WebhookResponseDto,
  ProviderType,
  PropertyType,
  NotificationStatus,
  ErrorDto,
  InstallationRequestDto,
} from 'src/dtos';
import { IntegrationProvider } from '../interface';

const MAILJET_API_VERSION = 'v3.1';

export class MailjetApiProvider implements IntegrationProvider {
  name = 'mailjet';

  spec = {
    displayName: 'Mailjet SMTP',
    description: {
      en: 'Send Emails using Mailjet API',
    },
    type: ProviderType.EMAIL,
    logoSvg:
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 520 520' style='enable-background:new 0 0 520 520' xml:space='preserve'><path d='M30.6 234.1 181.9 303l30.5-30.5-77.5-35.3 240.2-92.4L282.8 385l-35-77.1-30.5 30.5 1.6 3.5 67 147.5L445.4 74.6 30.6 234.1z' style='fill:#fead0d'/></svg>",
    properties: {
      apiKey: {
        type: PropertyType.SECRET,
        displayName: {
          en: 'API Key',
        },
        description: {
          en: 'The API Key from https://app.mailjet.com/account/relay.',
        },
        required: true,
      },
      secretKey: {
        type: PropertyType.SECRET,
        displayName: {
          en: 'Secret Key',
        },
        description: {
          en: 'The secret key from https://app.mailjet.com/account/relay.',
        },
        required: true,
      },
      fromEmail: {
        type: PropertyType.STRING,
        displayName: {
          en: 'From Email',
        },
        description: {
          en: 'The email-address of the sender.',
        },
        required: true,
        summary: true,
      },
      fromName: {
        type: PropertyType.STRING,
        displayName: {
          en: 'From Name.',
        },
        description: {
          en: 'The display name of the sender.',
        },
      },
    },
  };

  getSpec() {
    return this.spec;
  }

  async install(request: InstallationRequestDto): Promise<any> {
    const {
      apiKey,
      secretKey,
    }: {
      apiKey: string;
      secretKey: string;
    } = request.properties as any;

    const mailjet = Client.apiConnect(apiKey, secretKey);

    const data: Webhook.PostEventCallbackUrlBody = {
      Url: request.webhookUrl,
    };

    const result: LibraryResponse<any> = await mailjet
      .post('eventcallbackurl', { version: MAILJET_API_VERSION })
      .request(data);

    const { status, statusText } = result.response;

    if (status >= 400) {
      throw new BadRequestException({
        statusText,
        message: status,
      });
    }
  }

  async uninstall(request: InstallationRequestDto): Promise<any> {
    const {
      apiKey,
      secretKey,
    }: {
      apiKey: string;
      secretKey: string;
    } = request.properties as any;

    const mailjet = Client.apiConnect(apiKey, secretKey);

    const result: LibraryResponse<Webhook.GetEventCallbackUrlResponse> =
      await mailjet
        .get('eventcallbackurl', { version: MAILJET_API_VERSION })
        .request();

    const id = result.body.Data.find((x) => x.Url == request.webhookUrl)?.ID;

    if (!id) {
      return;
    }

    await mailjet.delete(`eventcallbackurl/${id}`).request();
  }

  async sendEmail?(request: SendEmailRequestDto) {
    const {
      apiKey,
      fromEmail,
      fromName,
      secretKey,
    }: {
      apiKey: string;
      fromEmail?: string;
      fromName?: string;
      secretKey: string;
    } = request.properties as any;

    const mailjet = Client.apiConnect(apiKey, secretKey);

    const data: SendEmailV3_1.Body = {
      Messages: [
        {
          From: {
            Email: request.payload.fromEmail || fromEmail,
            Name: request.payload.fromName || fromName,
          },
          To: [
            {
              Email: request.payload.to,
            },
          ],
          Subject: request.payload.subject,
          HTMLPart: request.payload.bodyHtml,
          TextPart: request.payload.bodyText,
          CustomID: request.trackingToken,
        },
      ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
      .post('send', { version: MAILJET_API_VERSION })
      .request(data);

    const { Status, Errors } = result.body.Messages[0];

    if (Status == 'success') {
      return NotificationStatusDto.status(
        NotificationStatus.SENT,
        request.trackingToken,
      );
    } else {
      return NotificationStatusDto.errors(
        Errors.map((x) => {
          const error = new ErrorDto();
          error.message = x.ErrorMessage;

          return error;
        }),
        request.trackingToken,
      );
    }
  }

  async handleWebhook(request: WebhookRequestDto) {
    const parsed = JSON.parse(request.body);

    const [statusCode, detail] = this.getStatus(parsed.event);

    const status = new NotificationStatusDto();
    status.status = statusCode;
    status.detail = detail;
    status.trackingToken = parsed.CustomID;

    const result = new WebhookResponseDto();
    result.status = status;

    return result;
  }

  private getStatus(event: string): [NotificationStatus, string | undefined] {
    switch (event) {
      case 'open':
        return [NotificationStatus.DELIVERED, 'Opened'];
      case 'bounce':
        return [NotificationStatus.FAILED, 'Bounced'];
      case 'click':
        return [NotificationStatus.DELIVERED, 'Clicked'];
      case 'sent':
        return [NotificationStatus.SENT, undefined];
      case 'blocked':
        return [NotificationStatus.FAILED, 'Blocked'];
      case 'unsub':
        return [NotificationStatus.FAILED, 'Unsubscribed'];
      default:
        return [NotificationStatus.FAILED, undefined];
    }
  }
}
