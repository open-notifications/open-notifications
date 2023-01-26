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

export interface Provider {
  name: string;

  getSpec(context: RequestContextDto): ProviderInfoDto;

  install?(request: InstallationRequestDto): Promise<any>;

  uninstall?(request: InstallationRequestDto): Promise<any>;

  sendEmail?(request: SendEmailRequestDto): Promise<NotificationStatusDto>;

  sendSms?(request: SendSmsRequestDto): Promise<NotificationStatusDto>;

  handleWebhook?(request: WebhookRequestDto): Promise<WebhookResponseDto>;
}
