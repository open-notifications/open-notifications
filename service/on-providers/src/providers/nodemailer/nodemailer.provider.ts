import {
  ProviderInfoDto,
  SendEmailRequestDto,
  NotificationStatus,
  InstallationRequestDto,
  EmailPayloadDto,
  PropertyType,
  NotificationStatusDto,
} from 'src/dtos';
import { IntegrationProvider } from '../interface';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export abstract class NodemailerProvider implements IntegrationProvider {
  private spec: ProviderInfoDto;

  abstract get name(): string;

  getSpec() {
    return (this.spec ||= this.createSpecCore());
  }

  private createSpecCore() {
    const spec = this.createSpec();

    if (!spec.properties['fromEmail']) {
      spec.properties.fromEmail = {
        type: PropertyType.STRING,
        displayName: {
          en: 'From Email',
        },
        description: {
          en: 'The email-address of the sender.',
        },
        required: true,
        summary: true,
      };
    }

    if (!spec.properties['fromName']) {
      spec.properties.fromName = {
        type: PropertyType.STRING,
        displayName: {
          en: 'From Name.',
        },
        description: {
          en: 'The display name of the sender.',
        },
      };
    }

    return spec;
  }

  protected abstract createSpec(): ProviderInfoDto;

  protected abstract createTransport(
    properties: any,
  ): SMTPTransport | SMTPTransport.Options;

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

    return NotificationStatusDto.status(status, request.trackingToken);
  }

  private async sendEmailTo(properties: any, payload: EmailPayloadDto) {
    const {
      fromEmail,
      fromName,
    }: {
      fromEmail: string;
      fromName?: string;
    } = properties;

    const { bodyText, bodyHtml, subject, to } = payload;

    const transport = nodemailer.createTransport(
      this.createTransport(properties),
    );

    try {
      const info = await transport.sendMail({
        from: {
          name: payload.fromName || fromName || fromEmail,
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
