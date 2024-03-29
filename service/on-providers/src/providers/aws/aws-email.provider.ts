import { ProviderInfoDto, ProviderType, PropertyType } from 'src/dtos';
import { NodemailerProvider } from '../nodemailer/nodemailer.provider';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';

export class AwsEmailProvider extends NodemailerProvider {
  name = 'aws-email';

  protected createSpec(): ProviderInfoDto {
    return {
      displayName: 'AWS SES',
      description: {
        en: 'AWS Simple Email Service (SES). Probably the cheapest option for sending Emails.',
      },
      type: ProviderType.EMAIL,
      logoSvg:
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='14.7 23 39.515 24.641' xml:space='preserve' width='39.515' height='24.641'><path style='fill:#f7981f' transform='translate(-1.602 -.429)' d='m28.182 40.34-1.067-4.576h-.025l-1.106 4.576z'/><path d='M14.7 40.315v.666c0 3.311 3.579 6.66 7.991 6.66h23.533c4.412 0 7.991-3.35 7.991-6.66v-.666c0-3.078-3.098-6.943-7.081-7.283a5.118 5.118 0 0 0-8.011-4.055C37.543 25.457 34.016 23 29.907 23c-5.579 0-10.101 4.521-10.101 10.102 0 .1.012.195.015.293-2.993.867-5.121 4.371-5.121 6.92zm12.699 3.055-.572-2.275H24.11l-.599 2.275h-1.547l2.639-9.283h1.898l2.444 9.283zm9.012 0h-1.716l-1.196-6.994h-.026L32.29 43.37h-1.716l-1.795-9.283h1.496l1.221 7.215h.027l1.221-7.215h1.561l1.248 7.254h.026l1.209-7.254h1.469zm5.433.181c-2.301 0-2.821-1.533-2.821-2.834v-.221h1.482v.234c0 1.131.494 1.703 1.521 1.703.936 0 1.403-.664 1.403-1.354 0-.975-.493-1.404-1.325-1.65l-1.015-.352c-1.353-.52-1.937-1.221-1.937-2.547 0-1.691 1.144-2.627 2.886-2.627 2.379 0 2.626 1.482 2.626 2.443v.209h-1.482v-.195c0-.846-.377-1.34-1.3-1.34-.637 0-1.248.352-1.248 1.34 0 .793.403 1.195 1.392 1.572l1 .365c1.313.467 1.886 1.184 1.886 2.457.001 1.979-1.196 2.797-3.068 2.797z' style='fill:#f7981f'/><path d='m24.603 34.087-2.639 9.283h1.547l.599-2.275h2.717l.572 2.275h1.547l-2.444-9.283zm-.221 5.824 1.105-4.576h.025l1.066 4.576z' style='fill:#fff'/><path style='fill:#fff' transform='translate(-1.602 -.429)' d='M35.906 34.516h-1.56l-1.221 7.214h-.027l-1.221-7.214h-1.496l1.795 9.283h1.716l1.182-6.994h.027l1.196 6.994h1.716l1.845-9.283H38.39l-1.209 7.254h-.027z'/><path d='m43.027 38.3-1-.365c-.988-.377-1.392-.779-1.392-1.572 0-.988.611-1.34 1.248-1.34.923 0 1.3.494 1.3 1.34v.195h1.482v-.209c0-.961-.247-2.443-2.626-2.443-1.742 0-2.886.936-2.886 2.627 0 1.326.584 2.027 1.937 2.547l1.015.352c.832.246 1.325.676 1.325 1.65 0 .689-.468 1.354-1.403 1.354-1.027 0-1.521-.572-1.521-1.703v-.234h-1.482v.221c0 1.301.521 2.834 2.821 2.834 1.872 0 3.068-.818 3.068-2.795 0-1.276-.573-1.993-1.886-2.459z' style='fill:#fff'/></svg>",
      properties: {
        region: {
          type: PropertyType.STRING,
          displayName: {
            en: 'Region',
          },
          description: {
            en: 'The region of the datacenter',
          },
          required: true,
          // https://docs.aws.amazon.com/general/latest/gr/ses.html
          allowedValues: [
            'af-south-1',
            'ap-northeast-1',
            'ap-northeast-2',
            'ap-northeast-3',
            'ap-south-1	',
            'ap-southeast-1',
            'ap-southeast-2',
            'ap-southeast-3	',
            'ca-central-1',
            'eu-central-1',
            'eu-north-1',
            'eu-south-1',
            'eu-west-1',
            'eu-west-2',
            'eu-west-3',
            'me-south-1',
            'sa-east-1',
            'us-east-1',
            'us-east-2',
            'us-gov-west-1',
            'us-west-1',
            'us-west-2',
          ],
        },
        accessKeyId: {
          type: PropertyType.SECRET,
          displayName: {
            en: 'Access Key ID',
          },
          description: {
            en: 'AWS Key ID.',
          },
          defaultValue: 587,
        },
        secretAccessKey: {
          type: PropertyType.STRING,
          displayName: {
            en: 'Secret access key.',
          },
          description: {
            en: 'AWS secret access key.',
          },
        },
      },
    };
  }

  protected createTransport(
    properties: any,
  ): SMTPTransport | SMTPTransport.Options {
    const {
      accessKeyId,
      region,
      secretAccessKey,
    }: {
      accessKeyId: string;
      region: string;
      secretAccessKey: string;
    } = properties;

    const ses = new SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    return { SES: { ses, aws: { SendRawEmailCommand } } } as any;
  }
}
