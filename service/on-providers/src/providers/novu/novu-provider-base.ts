import { IProviderConfig } from '@novu/shared';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { ProviderInfoDto, ProviderType, PropertyType } from 'src/dtos';
import { IntegrationProvider } from '../interface';

const Extensions = {
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  jpeg: 'image/Jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export abstract class NovuProviderBase implements IntegrationProvider {
  private readonly filePath: string;
  private readonly fileType: string;

  readonly name: string;
  readonly spec: ProviderInfoDto;

  constructor(
    type: ProviderType,
    prefix: string,
    description: string,
    providerConfig: IProviderConfig,
    providerLogo?: string,
  ) {
    this.name = `${prefix}_${providerConfig.id}`;

    this.spec = {
      displayName: providerConfig.displayName,
      description: {
        en: description,
      },
      properties: {},
      type,
      logoSvg: providerLogo,
    };

    for (const credential of providerConfig.credentials) {
      let type = PropertyType.STRING;
      switch (credential.type) {
        case 'number':
          type = PropertyType.NUMBER;
          break;
        case 'switch':
          type = PropertyType.BOOLEAN;
          break;
      }

      this.spec.properties[credential.key] = {
        displayName: {
          en: credential.displayName,
        },
        description: {
          en: credential.description,
        },
        type,
        required: credential.required,
      };
    }

    for (const [extension, mimeType] of Object.entries(Extensions)) {
      const path = join(
        process.cwd(),
        'assets',
        'novu',
        'square',
        `${providerConfig.id}.${extension}`,
      );

      if (existsSync(path)) {
        this.filePath = path;
        this.fileType = mimeType;
        return;
      }
    }

    throw new Error(`Cannot find image for provider ${providerConfig.id}.`);
  }

  getSpec(): ProviderInfoDto {
    return this.spec;
  }

  async image() {
    const file = createReadStream(this.filePath);

    return { file, contentType: this.fileType };
  }
}
