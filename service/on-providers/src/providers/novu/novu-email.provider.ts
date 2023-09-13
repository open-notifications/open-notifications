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
  ProviderType,
} from 'src/dtos';
import { NovuProviderBase } from './novu-provider-base';

export class NovuEmailProvider extends NovuProviderBase {
  constructor(
    private readonly factory: (config: any) => IEmailProvider,
    providerConfig: IProviderConfig,
    providerLogo?: string,
  ) {
    super(
      ProviderType.EMAIL,
      'novu_email',
      `Send Email over ${providerConfig.displayName}`,
      providerConfig,
      providerLogo,
    );
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
      id: request.trackingToken,
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

    if (!provider.parseEventBody || !provider.getMessageId) {
      return {};
    }

    const parsedBody = JSON.parse(request.body);

    let ids = provider.getMessageId(parsedBody);
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const statuses: NotificationStatusDto[] = [];

    for (const id of ids) {
      const parsed = provider.parseEventBody(parsedBody, id);

      statuses.push(
        NotificationStatusDto.status(
          parseStatus(parsed),
          request.trackingToken,
        ),
      );
    }

    return { statuses };
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
