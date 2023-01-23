import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

export type LocalizedString = { [languageCode: string]: string };

export type PropertyValue = string | boolean | number | null;
export type PropertyValues = { [key: string]: PropertyValue };

export enum ProviderType {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum ErrorCode {
  VALIDATION_ERROR = 'validation',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'delete',
}

export enum PropertyType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  SECRET = 'secret',
  STRING = 'string',
  TEXT = 'text',
  URL = 'url',
}

export enum NotificationStatus {
  DELIVERED = 'delivered',
  FAILED = 'failed',
  PENDING = 'pending',
  SENT = 'sent',
  UNKNOWN = 'unknown',
}

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

export class GetProvidersRequestDto extends BaseRequestDto {
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
    enum: PropertyType,
  })
  @IsDefined()
  @IsEnum(PropertyType)
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

  @ApiProperty({
    enum: ProviderType,
  })
  @IsDefined()
  @IsEnum(ProviderType)
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
export class GetProvidersResponseDto {
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
  fromEmail?: string;

  @ApiProperty()
  @IsOptional()
  fromName?: string;

  @ApiProperty()
  @IsOptional()
  bodyText?: string;

  @ApiProperty()
  @IsOptional()
  bodyHtml?: string;
}

export class SendEmailRequestDto extends SendRequestDto<EmailPayloadDto> {
  // Empty
}

export class SmsPayloadDto {
  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  body: string;
}

export class SendSmsRequestDto extends SendRequestDto<SmsPayloadDto> {
  // Empty
}

export class WebhookRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @IsDefined()
  @IsEnum(HttpMethod)
  method: HttpMethod;

  @ApiProperty({
    additionalProperties: { type: 'string' },
  })
  @IsDefined()
  @IsObject()
  query: { [key: string]: string[] };

  @ApiProperty({
    additionalProperties: { type: 'array', items: { type: 'string' } },
  })
  @IsDefined()
  @IsObject()
  headers: { [key: string]: string };

  @ApiProperty()
  @IsOptional()
  @IsString()
  body?: string;
}

export class WebhookResponseDto {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  http?: WebhookHttpResponseDto;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  status?: NotificationStatusDto;
}

export class WebhookHttpResponseDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    additionalProperties: { type: 'array', items: { type: 'string' } },
  })
  @IsOptional()
  @IsObject()
  headers?: { [key: string]: string };

  @ApiProperty()
  @IsOptional()
  @IsString()
  body?: string;
}

export class ErrorDto {
  @ApiProperty({
    enum: ErrorCode,
  })
  @IsDefined()
  @IsEnum(ErrorCode)
  code: ErrorCode;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  field?: string;
}

export class NotificationStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  status: NotificationStatus;

  @ApiProperty()
  @IsOptional()
  notificationId?: string;

  @ApiProperty()
  @IsOptional()
  errors?: ErrorDto[];

  static status(status: NotificationStatus, notificationId?: string) {
    const result = new NotificationStatusDto();
    result.status = status;
    result.notificationId = notificationId;

    return result;
  }

  static errors(errors: ErrorDto[], notificationId?: string) {
    const result = new NotificationStatusDto();
    result.errors = errors;
    result.notificationId = notificationId;

    return result;
  }
}