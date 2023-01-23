import {
  InstallationRequestDto,
  NotificationStatus,
  ProviderInfoDto,
  RequestContextDto,
  SendEmailRequestDto,
  SendSmsRequestDto,
  WebhookRequestDto,
  WebhookResponseDto,
} from './../dtos';

export interface Provider {
  name: string;

  getSpec(context: RequestContextDto): ProviderInfoDto;

  install?(request: InstallationRequestDto): Promise<any>;

  uninstall?(request: InstallationRequestDto): Promise<any>;

  sendEmail?(request: SendEmailRequestDto): Promise<NotificationStatus>;

  sendSms?(request: SendSmsRequestDto): Promise<NotificationStatus>;

  handleWebhook?(request: WebhookRequestDto): Promise<WebhookResponseDto>;
}
