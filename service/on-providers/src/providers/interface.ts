import { Readable } from 'stream';
import {
  InstallationRequestDto,
  NotificationStatusDto,
  ProviderInfoDto,
  RequestContextDto,
  SendEmailRequestDto,
  SendSmsRequestDto,
  WebhookRequestDto,
  WebhookResponseDto,
} from './../dtos';

export interface IntegrationProvider {
  name: string;

  getSpec(context: RequestContextDto): ProviderInfoDto;

  install?(request: InstallationRequestDto): Promise<any>;

  uninstall?(request: InstallationRequestDto): Promise<any>;

  sendEmail?(request: SendEmailRequestDto): Promise<NotificationStatusDto>;

  sendSms?(request: SendSmsRequestDto): Promise<NotificationStatusDto>;

  handleWebhook?(request: WebhookRequestDto): Promise<WebhookResponseDto>;

  image?(): Promise<{ file: Readable; contentType: string } | null>;
}
