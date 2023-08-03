import { IProviderConfig } from '@novu/shared';
import {
  ISMSEventBody,
  ISmsProvider,
  SmsEventStatusEnum,
} from '@novu/stateless';
import {
  NotificationStatusDto,
  SendSmsRequestDto,
  WebhookRequestDto,
  WebhookResponseDto,
  NotificationStatus,
} from 'src/dtos';
import { NovuProviderBase } from './novu-provider-base';

export class NovuSmsProvider extends NovuProviderBase {
  constructor(
    private readonly factory: (config: any) => ISmsProvider,
    providerConfig: IProviderConfig,
    providerLogo?: string,
  ) {
    super('novu_email', providerConfig, providerLogo);
  }

  async sendSms?(request: SendSmsRequestDto): Promise<NotificationStatusDto> {
    const provider = this.factory(request.properties);

    await provider.sendMessage({
      to: request.payload.to,
      content: request.payload.body,
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

function parseStatus(parsed: ISMSEventBody): NotificationStatus {
  switch (parsed.status) {
    case SmsEventStatusEnum.DELIVERED:
      return NotificationStatus.DELIVERED;
    case SmsEventStatusEnum.ACCEPTED:
    case SmsEventStatusEnum.CREATED:
    case SmsEventStatusEnum.QUEUED:
    case SmsEventStatusEnum.SENDING:
    case SmsEventStatusEnum.SENT:
      return NotificationStatus.SENT;
    default:
      return NotificationStatus.FAILED;
  }
}
