import { MessageBirdSmsProvider } from './messagebird/messagebird-sms.provider';
import { SmtpProvider } from './smtp/smtp.provider';
import { TwilioSmsProvider } from './twilio/twilio-sms.provider';
export * from './interface';

export const Providers = {
  provide: 'PROVIDERS',
  useFactory: () => [
    new SmtpProvider(),
    new MessageBirdSmsProvider(),
    new TwilioSmsProvider(),
  ],
};
