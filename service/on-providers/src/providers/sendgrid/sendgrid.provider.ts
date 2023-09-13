import { ProviderType, PropertyType, ProviderInfoDto } from 'src/dtos';
import { NodemailerProvider } from '../nodemailer/nodemailer.provider';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class SendGridProvider extends NodemailerProvider {
  name = 'sendgrid';

  protected createSpec(): ProviderInfoDto {
    return {
      displayName: 'Sendgrid',
      description: {
        en: 'Send Emails using Sendgrid SMTP Server.',
      },
      type: ProviderType.EMAIL,
      logoSvg:
        "<svg viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M10.664 32h10.667V21.333H10.664V32ZM0 21.333h10.667V10.666H0v10.667Z' fill='#9DD6E3'/><path fill-rule='evenodd' clip-rule='evenodd' d='M0 32h10.667V21.333H0V32Z' fill='#3F72AB'/><path fill-rule='evenodd' clip-rule='evenodd' d='M21.336 21.333h10.667V10.666H21.336v10.667ZM10.664 10.667h10.667V0H10.664v10.667Z' fill='#00A9D1'/><path fill-rule='evenodd' clip-rule='evenodd' d='M10.664 21.333h10.667V10.666H10.664v10.667Z' fill='#2191C4'/><path fill-rule='evenodd' clip-rule='evenodd' d='M21.336 10.667h10.667V0H21.336v10.667Z' fill='#3F72AB'/></svg>",
      properties: {
        apiKey: {
          type: PropertyType.SECRET,
          displayName: {
            en: 'API Key',
          },
          description: {
            en: 'The API Key.',
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
      apiKey?: string;
      secretKey?: string;
    } = properties;

    return {
      host: 'in-v3.mailjet.com',
      port: 587,
      secure: true,
      auth: {
        user: apiKey,
        pass: secretKey,
      },
    };
  }
}
