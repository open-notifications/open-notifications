import { ProviderType, PropertyType, ProviderInfoDto } from 'src/dtos';
import { NodemailerProvider } from '../nodemailer/nodemailer.provider';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class MailjetSMTPProvider extends NodemailerProvider {
  name = 'mailjet-smpt';

  protected createSpec(): ProviderInfoDto {
    return {
      displayName: 'Mailjet SMPT',
      description: {
        en: 'Send Emails using Mailjet SMPT Server',
      },
      type: ProviderType.EMAIL,
      logoSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="76.289" y1=".424" x2="34.531" y2="55.84"><stop offset="0" stop-color="#ffbc48"/><stop offset="1" stop-color="#ffa414"/></linearGradient><path d="M21.095 23.454L20.12 30l-6.763 9.885 2.28-1.258 44.07-24.244zm-.227-1.74l29.125-6.62-1.892-.255L3 8.594l17.575 12.92zm65.835 24.272c-.322 1.892-.52 2.308-4.52 5.42l-.955-1.305c3.074-2.507 3.462-2.8 3.746-4.465l2.885-16.355 1.863-.255zm2.27-23.213l1.863-.255-.643 3.623-1.835.255zM92.2 40.69l-.057.842c0 1.305.51 1.986 2.686 1.986 1.807 0 3.594-.605 5.524-1.504l.454 1.38c-1.892 1.003-4.067 1.703-6.186 1.703-2.932 0-4.266-1.154-4.266-3.52.01-.52.066-1.03.17-1.532l.918-5.25c.72-3.973 2.762-5.93 6.773-5.93 2.535 0 4.143 1.286 4.143 3.623 0 2.507-1.665 3.85-5.94 5.042l-3.82 1.06zm8.4-8.267c0-1.41-.927-2.053-2.563-2.053-2.8 0-4.266 1.447-4.815 4.52l-.35 1.986 3.623-.955c2.923-.766 4.105-1.826 4.105-3.5zm3.538 10.594c.01-.208.028-.407.066-.605l2.053-11.7h-2.99l.255-1.532h3.017l.672-3.82 1.835-.255-.7 4.067H113l-.35 1.532h-4.616l-2.015 11.512a3.99 3.99 0 0 0-.066.577c0 .605.312.757 1.06.757.87 0 1.958-.255 3.112-.728l.454 1.21a8.12 8.12 0 0 1-3.888 1.059c-1.57.01-2.573-.662-2.573-2.072zm-65.495-12.23c2.053-1.126 4.493-1.958 6.31-1.958 1.636 0 2.44.832 2.734 1.986 2.213-1.286 4.616-1.986 6.413-1.986 2.138 0 2.857 1.41 2.857 3.112a6.92 6.92 0 0 1-.17 1.532L54.78 44.766h-3.85l1.958-11.124c.028-.142.028-.284.028-.426 0-.407-.2-.662-.804-.662-1.03 0-3.216.955-4.644 1.835l-1.835 10.396h-3.85L43.74 33.66c.028-.142.038-.284.028-.426 0-.407-.2-.662-.804-.662-1.03 0-3.216.955-4.644 1.835l-1.835 10.396h-3.85l2.072-11.663m34.705 11.635h-3.235l-.028-1.73c-1.334 1.23-3.017 2.053-5.098 2.053-2.686 0-3.632-1.438-3.632-3.566.01-.55.066-1.097.17-1.636l.804-4.55c.728-4.238 1.73-6.508 7.766-6.508 1.504 0 4.294.482 5.902 1.003zM67.776 32.3a11.56 11.56 0 0 0-2.213-.227c-2.47 0-2.96 1.03-3.292 3.074l-.974 5.477c-.028.123-.028.255-.028.378 0 .577.35.832 1.06.832 1.21 0 2.99-1.154 4.17-2.336zm6.735-2.847l3.944-.54-2.8 15.872h-3.85zm1.182-6.678l3.944-.54-.757 4.35-3.944.577zm6.423 0l3.944-.54-3.973 22.54h-3.85z" fill="url(#A)"/></svg>',
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
    }: {
      apiKey?: string;
    } = properties;

    return {
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: true,
      auth: {
        user: 'apikey',
        pass: apiKey,
      },
    };
  }
}