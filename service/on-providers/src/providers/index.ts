import { AwsEmailProvider } from './aws/aws-email.provider';
import { MessageBirdSmsProvider } from './messagebird/messagebird-sms.provider';
import { SmtpProvider } from './smtp/smtp.provider';
import { TwilioSmsProvider } from './twilio/twilio-sms.provider';
export * from './interface';

export const Providers = {
  provide: 'PROVIDERS',
  useFactory: () => [
    new AwsEmailProvider(),
    new MessageBirdSmsProvider(),
    new SmtpProvider(),
    new TwilioSmsProvider(),
  ],
};
