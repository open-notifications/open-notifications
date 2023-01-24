import { AwsEmailProvider } from './aws/aws-email.provider';
import { MailjetSMTPProvider } from './mailjet/mailjet-smtp.provider';
import { MessageBirdSmsProvider } from './messagebird/messagebird-sms.provider';
import { SendGridProvider } from './sendgrid/sendgrid.provider';
import { SmtpProvider } from './smtp/smtp.provider';
import { TwilioSmsProvider } from './twilio/twilio-sms.provider';
export * from './interface';

export const Providers = {
  provide: 'PROVIDERS',
  useFactory: () => [
    new AwsEmailProvider(),
    new MailjetSMTPProvider(),
    new MessageBirdSmsProvider(),
    new SendGridProvider(),
    new SmtpProvider(),
    new TwilioSmsProvider(),
  ],
};
