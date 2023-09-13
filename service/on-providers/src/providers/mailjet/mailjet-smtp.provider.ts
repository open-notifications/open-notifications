import { ProviderType, PropertyType, ProviderInfoDto } from 'src/dtos';
import { NodemailerProvider } from '../nodemailer/nodemailer.provider';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class MailjetSMTPProvider extends NodemailerProvider {
  name = 'mailjet-smtp';

  protected createSpec(): ProviderInfoDto {
    return {
      displayName: 'Mailjet SMTP',
      description: {
        en: 'Send Emails using Mailjet SMTP Server.',
      },
      type: ProviderType.EMAIL,
      logoSvg:
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 520 520' style='enable-background:new 0 0 520 520' xml:space='preserve'><path d='M30.6 234.1 181.9 303l30.5-30.5-77.5-35.3 240.2-92.4L282.8 385l-35-77.1-30.5 30.5 1.6 3.5 67 147.5L445.4 74.6 30.6 234.1z' style='fill:#fead0d'/></svg>",
      properties: {
        apiKey: {
          type: PropertyType.SECRET,
          displayName: {
            en: 'API Key',
          },
          description: {
            en: 'The API Key from https://app.mailjet.com/account/relay.',
          },
          required: true,
        },
        secretKey: {
          type: PropertyType.SECRET,
          displayName: {
            en: 'Secret Key',
          },
          description: {
            en: 'The secret key from https://app.mailjet.com/account/relay.',
          },
          required: true,
        },
      },
    };
  }

  protected createTransport(
    properties: any,
  ): SMTPTransport | SMTPTransport.Options {
    const {
      apiKey,
      secretKey,
    }: {
      apiKey: string;
      secretKey: string;
    } = properties;

    return {
      host: 'in-v3.mailjet.com',
      port: 465,
      auth: {
        user: apiKey,
        pass: secretKey,
      },
    };
  }
}
