import { AwsEmailProvider } from './aws/aws-email.provider';
import { MailjetApiProvider } from './mailjet/mailjet-api.provider';
import { MailjetSMTPProvider } from './mailjet/mailjet-smtp.provider';
import { MessageBirdSmsProvider } from './messagebird/messagebird-sms.provider';
import { NOVU_EMAIL_PROVIDERS, NOVU_SMS_PROVIDERS } from './novu';
import { SendGridProvider } from './sendgrid/sendgrid.provider';
import { SmtpProvider } from './smtp/smtp.provider';
import { TwilioSmsProvider } from './twilio/twilio-sms.provider';
export * from './interface';

export const Providers = {
  provide: 'PROVIDERS',
  useFactory: () => [
    new AwsEmailProvider(),
    new MailjetApiProvider(),
    new MailjetSMTPProvider(),
    new MessageBirdSmsProvider(),
    new SendGridProvider(),
    new SmtpProvider(),
    new TwilioSmsProvider(),
    ...NOVU_EMAIL_PROVIDERS,
    ...NOVU_SMS_PROVIDERS,
  ],
};
