import {
  InstallationRequestDto,
  NotificationStatus,
  ProviderInfoDto,
  RequestContextDto,
  SendEmailDto,
  SendSmsDto,
} from './../dtos';

export interface Provider {
  name: string;

  getSpec(context: RequestContextDto): ProviderInfoDto;

  install?(request: InstallationRequestDto): Promise<any>;

  uninstall?(request: InstallationRequestDto): Promise<any>;

  sendEmail?(request: SendEmailDto): Promise<NotificationStatus>;

  sendSms?(request: SendSmsDto): Promise<NotificationStatus>;
}
