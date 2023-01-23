import {
  ProviderInfoDto,
  SendEmailRequestDto,
  NotificationStatus,
  InstallationRequestDto,
  EmailPayloadDto,
  ProviderType,
  PropertyType,
  NotificationStatusDto,
} from 'src/dtos';
import { Provider } from '../interface';
import * as nodemailer from 'nodemailer';

export class SmtpProvider implements Provider {
  name = 'smtp';

  spec: ProviderInfoDto = {
    displayName: 'SMTP',
    description: {
      en: 'Send Emails using any SMPT email server',
    },
    type: ProviderType.EMAIL,
    properties: {
      serverHost: {
        type: PropertyType.STRING,
        displayName: {
          en: 'Host',
        },
        description: {
          en: 'The hostname of the server',
        },
        required: true,
      },
      serverPort: {
        type: PropertyType.NUMBER,
        displayName: {
          en: 'Port',
        },
        description: {
          en: 'The port of the server.',
        },
        defaultValue: 587,
      },
      username: {
        type: PropertyType.STRING,
        displayName: {
          en: 'Username',
        },
        description: {
          en: 'The username to authenticate with the server.',
        },
      },
      password: {
        type: PropertyType.SECRET,
        displayName: {
          en: 'Password',
        },
        description: {
          en: 'The password to authenticate with the server.',
        },
      },
      fromEmail: {
        type: PropertyType.STRING,
        displayName: {
          en: 'From Email',
        },
        description: {
          en: 'The email-address of the sender.',
        },
      },
      fromName: {
        type: PropertyType.STRING,
        displayName: {
          en: 'From Name.',
        },
        description: {
          en: 'The display name of the sender.',
        },
      },
    },
  };

  getSpec() {
    return this.spec;
  }

  async install(request: InstallationRequestDto) {
    await this.sendEmailTo(request.properties, {
      to: 'noreply@email.com',
      bodyHtml: undefined,
      bodyText: 'Test Email',
      subject: 'Test Email',
    });
  }

  async sendEmail?(request: SendEmailRequestDto) {
    const status = await this.sendEmailTo(request.properties, request.payload);

    return NotificationStatusDto.status(status);
  }

  private async sendEmailTo(properties: any, payload: EmailPayloadDto) {
    const {
      fromEmail,
      fromName,
      password,
      serverHost,
      serverPort,
      username,
    }: {
      fromEmail: string;
      fromName?: string;
      password?: string;
      serverHost: string;
      serverPort?: number;
      username?: string;
    } = properties;

    const { bodyText, bodyHtml, subject, to } = payload;

    const transport = nodemailer.createTransport({
      host: serverHost,
      port: serverPort || 587,
      secure: true,
      auth:
        username && password
          ? {
              user: username,
              pass: password,
            }
          : undefined,
    });

    try {
      const info = await transport.sendMail({
        from: {
          name: payload.fromName || fromName,
          address: payload.fromEmail || fromEmail,
        },
        to,
        subject,
        text: bodyText,
        html: bodyHtml,
      });

      if (info.accepted.find((x) => x === to || x['address'] === to)) {
        return NotificationStatus.SENT;
      }

      if (info.rejected.find((x) => x === to || x['address'] === to)) {
        return NotificationStatus.FAILED;
      }

      if (info.pending.find((x) => x === to || x['address'] === to)) {
        return NotificationStatus.PENDING;
      }

      return NotificationStatus.UNKNOWN;
    } finally {
      transport.close?.();
    }
  }
}
