/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IProviderConfig } from '@novu/shared';
import {
  EmailEventStatusEnum,
  IEmailEventBody,
  IEmailProvider,
} from '@novu/stateless';
import {
  NotificationStatusDto,
  NotificationStatus,
  SendEmailRequestDto,
  WebhookRequestDto,
  WebhookResponseDto,
} from 'src/dtos';
import { NovuProviderBase } from './novu-provider-base';

export class NovuEmailProvider extends NovuProviderBase {
  constructor(
    private readonly factory: (config: any) => IEmailProvider,
    providerConfig: IProviderConfig,
    providerLogo?: string,
  ) {
    super('novu_email', providerConfig, providerLogo);
  }

  async sendEmail?(
    request: SendEmailRequestDto,
  ): Promise<NotificationStatusDto> {
    const options = {
      ...request.properties,
      senderName: request.payload.fromName,
    };

    const provider = this.factory(options);

    await provider.sendMessage({
      from: request.payload.fromEmail!,
      to: [request.payload.to!],
      subject: request.payload.subject,
      html: request.payload.bodyHtml,
      text: request.payload.bodyText,
    });

    return NotificationStatusDto.status(
      NotificationStatus.SENT,
      request.trackingToken,
    );
  }

  async handleWebhook?(
    request: WebhookRequestDto,
  ): Promise<WebhookResponseDto> {
    const provider = this.factory(request.properties);

    if (!provider.parseEventBody) {
      return {};
    }

    const parsed = provider.parseEventBody(
      JSON.parse(request.body),
      request.trackingToken,
    );

    return {
      status: NotificationStatusDto.status(
        parseStatus(parsed),
        request.trackingToken,
      ),
      http: {
        body: parsed.response,
      },
    };
  }
}

function parseStatus(parsed: IEmailEventBody): NotificationStatus {
  switch (parsed.status) {
    case EmailEventStatusEnum.CLICKED:
    case EmailEventStatusEnum.DELIVERED:
    case EmailEventStatusEnum.OPENED:
      return NotificationStatus.DELIVERED;
    case EmailEventStatusEnum.DEFERRED:
    case EmailEventStatusEnum.DELAYED:
    case EmailEventStatusEnum.SENT:
      return NotificationStatus.SENT;
    default:
      return NotificationStatus.FAILED;
  }
}
