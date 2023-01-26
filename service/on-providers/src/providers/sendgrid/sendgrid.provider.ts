import { ProviderType, PropertyType, ProviderInfoDto } from 'src/dtos';
import { NodemailerProvider } from '../nodemailer/nodemailer.provider';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class SendGridProvider extends NodemailerProvider {
  name = 'sendgrid';

  protected createSpec(): ProviderInfoDto {
    return {
      displayName: 'Sendgrid',
      description: {
        en: 'Send Emails using Sendgrid SMPT Server',
      },
      type: ProviderType.EMAIL,
      logoSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><path d="M40.973 34.43l2.3-1.81c.644 1.134 1.686 1.778 2.882 1.778 1.288 0 1.993-.828 1.993-1.748 0-1.104-1.318-1.44-2.76-1.87-1.778-.552-3.77-1.226-3.77-3.802 0-2.146 1.87-3.832 4.415-3.832 2.177 0 3.403.828 4.476 1.932l-2.085 1.594c-.552-.828-1.318-1.257-2.36-1.257-1.196 0-1.81.644-1.81 1.472 0 1.012 1.288 1.38 2.698 1.84 1.81.583 3.832 1.38 3.832 3.924 0 2.116-1.686 4.14-4.6 4.14-2.39.03-4.016-.98-5.212-2.36zm20.39-6.898h2.483v1.012c.583-.736 1.472-1.196 2.514-1.196 2.146 0 3.434 1.38 3.434 3.74v5.55h-2.545v-5.212c0-1.226-.552-1.932-1.686-1.932-.95 0-1.717.644-1.717 2.177v4.967H61.36zm9.014 4.568c0-3.22 2.36-4.752 4.415-4.752 1.196 0 2.116.43 2.73 1.073v-5.09h2.483v13.306H77.52v-1.012c-.613.705-1.564 1.196-2.76 1.196-1.932 0-4.384-1.533-4.384-4.722zm7.205-.03c0-1.35-.98-2.453-2.33-2.453a2.4 2.4 0 0 0-2.453 2.453 2.38 2.38 0 0 0 2.453 2.453c1.35 0 2.33-1.104 2.33-2.453zm3.005-2.085c0-3.802 2.85-6.837 6.806-6.837 1.962 0 3.618.705 4.814 1.84.49.46.89.98 1.226 1.564l-2.207 1.35c-.828-1.502-2.085-2.3-3.802-2.3-2.422 0-4.292 1.993-4.292 4.384 0 2.453 1.84 4.384 4.384 4.384 1.932 0 3.31-1.104 3.77-2.8h-4.17v-2.422h6.898v1.012c0 3.556-2.545 6.653-6.5 6.653-4.17 0-6.93-3.158-6.93-6.837zm14.042-2.453H97.1v1.502c.46-.95 1.288-1.502 2.514-1.502h1.012l-.92 2.422h-.675c-1.318 0-1.9.705-1.9 2.39v4.292h-2.514zm6.653 0h2.483v9.106h-2.483v-6.684h-.92zm1.257-1.38c.828 0 1.502-.675 1.502-1.502s-.675-1.502-1.502-1.502-1.502.675-1.502 1.502.675 1.502 1.502 1.502zm1.84 5.948c0-3.22 2.36-4.752 4.415-4.752 1.196 0 2.115.43 2.73 1.073v-5.09h2.483v13.306h-2.483v-1.012c-.613.705-1.564 1.196-2.76 1.196-1.932 0-4.384-1.533-4.384-4.722zm7.205-.03c0-1.35-.98-2.453-2.33-2.453a2.4 2.4 0 0 0-2.453 2.453 2.38 2.38 0 0 0 2.453 2.453c1.35 0 2.33-1.104 2.33-2.453zm-50.803 0c0-2.637-1.9-4.722-4.69-4.722-2.637 0-4.752 2.116-4.752 4.752s1.962 4.752 4.814 4.752c1.962 0 3.373-.95 4.17-2.3l-1.993-1.196c-.43.797-1.226 1.318-2.177 1.318-1.318 0-2.146-.644-2.422-1.656h7.02v-.95zm-6.93-1.104c.368-.858 1.196-1.44 2.238-1.44s1.84.49 2.177 1.44z" fill="#263746"/><path d="M5.996 24.96h10.02v10.02H5.996z" fill="#fff"/><path d="M5.996 24.96h10.02v10.02H5.996z" fill="#99e1f4" enable-background="new "/><path d="M16.016 34.98h9.963v9.963h-9.963z" fill="#fff"/><path d="M16.016 34.98h9.963v9.963h-9.963z" fill="#99e1f4" enable-background="new "/><path d="M5.996 44.944h10.02v.058H5.996zm0-9.964h10.02v9.963H5.996z" fill="#1a82e2"/><path d="M16.016 14.998h9.963v9.963h-9.963zM25.98 25.02H36v9.963H25.98z" fill="#00b3e3"/><path d="M25.98 34.98V24.96h-9.963v10.02z" fill="#009dd9"/><g fill="#1a82e2"><path d="M25.98 14.998H36v9.963H25.98z"/><path d="M25.98 24.96H36v.058H25.98z"/></g></svg>',
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