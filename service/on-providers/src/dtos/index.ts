import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export type LocalizedString = { [languageCode: string]: string };

export type PropertyValue = string | boolean | number | null;
export type PropertyValues = { [key: string]: PropertyValue };

export type ProviderType = 'Email' | 'SMS';

export type PropertyType =
  | 'String'
  | 'Text'
  | 'Password'
  | 'Boolean'
  | 'Url'
  | 'Number';

export type NotificationStatus =
  | 'Pending'
  | 'Sent'
  | 'Delivered'
  | 'Failed'
  | 'Unknown';

export class RequestContextDto {
  @ApiProperty()
  @IsNotEmpty()
  hostUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  authHeaders: { [key: string]: string };

  @ApiProperty()
  @IsOptional()
  trusted?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  teanntId: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}

export class BaseRequestDto {
  @ApiProperty()
  @IsDefined()
  context: RequestContextDto;
}

export class GetProvidersRequest extends BaseRequestDto {
  // Empty
}

export class PropertyInfoDto {
  @ApiProperty({
    additionalProperties: { type: 'string' },
  })
  @IsObject()
  displayName: LocalizedString;

  @ApiProperty({
    additionalProperties: { type: 'string' },
  })
  @IsObject()
  description: LocalizedString;

  @ApiProperty({
    enum: ['String', 'Text', 'Password', 'Boolean', 'Url', 'Number'],
  })
  @IsObject()
  type: PropertyType;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @ApiProperty()
  @IsOptional()
  defaultValue?: any;

  @ApiProperty()
  @IsOptional()
  allowedValues?: any[];
}

@ApiExtraModels(PropertyInfoDto)
export class ProviderInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({
    additionalProperties: { type: 'string' },
  })
  @IsNotEmpty()
  description: LocalizedString;

  @ApiProperty()
  @IsObject()
  logoSvg?: string;

  @ApiProperty()
  @IsObject()
  logoRaster?: string;

  @ApiProperty()
  @IsNotEmpty()
  type: ProviderType;

  @ApiProperty({
    additionalProperties: { $ref: getSchemaPath(PropertyInfoDto) },
  })
  @IsObject()
  properties: { [name: string]: PropertyInfoDto };

  @ApiProperty({
    additionalProperties: { $ref: getSchemaPath(PropertyInfoDto) },
  })
  @IsOptional()
  @IsObject()
  userProperties?: { [name: string]: PropertyInfoDto };
}

@ApiExtraModels(ProviderInfoDto)
export class GetProvidersResponse {
  @ApiProperty({
    additionalProperties: { $ref: getSchemaPath(ProviderInfoDto) },
  })
  @IsObject()
  providers: { [name: string]: ProviderInfoDto };
}

export class InstallationRequestDto extends BaseRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @ApiProperty()
  @IsObject()
  properties: PropertyValues;

  @ApiProperty()
  @IsNotEmpty()
  webhookUrl: string;
}

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsObject()
  properties: PropertyValues;
}

export class SendRequestDto<T> extends BaseRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @ApiProperty()
  @IsObject()
  properties: PropertyValues;

  @ApiProperty()
  @IsObject()
  user: UserDto;

  @ApiProperty()
  @IsObject()
  payload: T;

  @ApiProperty()
  @IsNotEmpty()
  notificationId: string;

  @ApiProperty()
  @IsNotEmpty()
  trackingToken: string;

  @ApiProperty()
  @IsNotEmpty()
  trackingWebhookUrl: string;
}

export class EmailPayloadDto {
  @ApiProperty()
  @IsArray()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsDefined()
  fromEmail: string;

  @ApiProperty()
  @IsOptional()
  fromName?: string;

  @ApiProperty()
  @IsOptional()
  bodyText?: string;

  @ApiProperty()
  @IsOptional()
  bodyEmail?: string;
}

export class SendEmailDto extends SendRequestDto<EmailPayloadDto> {
  // Empty
}

export class SmsPayloadDto {
  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;
}

export class SendSmsDto extends SendRequestDto<SmsPayloadDto> {
  // Empty
}

export class SendResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  status: NotificationStatus;
}
