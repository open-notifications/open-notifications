import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

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
  @IsNotEmpty()
  hostUrl: string;

  @IsOptional()
  @IsObject()
  authHeaders: { [key: string]: string };

  @IsOptional()
  trusted?: boolean;

  @IsNotEmpty()
  teanntId: string;

  @IsNotEmpty()
  userId: string;
}

export class BaseRequestDto {
  @IsDefined()
  context: RequestContextDto;
}

export class GetProvidersRequest extends BaseRequestDto {
  // Empty
}

export class GetProvidersResponse {
  @IsObject()
  providers: { [name: string]: ProviderInfoDto };
}

export class ProviderInfoDto {
  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  description: LocalizedString;

  @IsObject()
  logo: SvgLogoDto | RasterLogoDto;

  @IsNotEmpty()
  type: ProviderType;

  @IsObject()
  properties: { [name: string]: PropertyInfoDto };

  @IsOptional()
  @IsObject()
  userProperties?: { [name: string]: PropertyInfoDto };
}

export class SvgLogoDto {
  @IsNotEmpty()
  svg: string;
}

export class RasterLogoDto {
  @IsNotEmpty()
  raster: string;
}

export class PropertyInfoDto {
  @IsObject()
  displayName: LocalizedString;

  @IsObject()
  description: LocalizedString;

  @IsObject()
  type: PropertyType;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsNumber()
  minLength?: number;

  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  minValue?: number;

  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @IsOptional()
  defaultValue?: any;
}

export class InstallationRequestDto extends BaseRequestDto {
  @IsNotEmpty()
  provider: string;

  @IsObject()
  properties: PropertyValues;

  @IsNotEmpty()
  webhookUrl: string;
}

export class UserDto {
  @IsNotEmpty()
  id: string;

  @IsObject()
  properties: PropertyValues;
}

export class SendRequestDto<T> extends BaseRequestDto {
  @IsNotEmpty()
  provider: string;

  @IsObject()
  properties: PropertyValues;

  @IsObject()
  user: UserDto;

  @IsObject()
  payload: T;

  @IsNotEmpty()
  notificationId: string;

  @IsNotEmpty()
  trackingToken: string;

  @IsNotEmpty()
  trackingWebhookUrl: string;
}

export class EmailPayloadDto {
  @IsArray()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsDefined()
  fromEmail: string;

  @IsOptional()
  fromName?: string;

  @IsOptional()
  bodyText?: string;

  @IsOptional()
  bodyEmail?: string;
}

export class SendEmailDto extends SendRequestDto<EmailPayloadDto> {
  // Empty
}

export class SmsPayloadDto {
  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  text: string;
}

export class SendSmsDto extends SendRequestDto<SmsPayloadDto> {
  // Empty
}

export class SendResponseDto {
  @IsNotEmpty()
  status: NotificationStatus;
}
