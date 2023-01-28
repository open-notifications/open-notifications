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

  @ApiProperty({ additionalProperties: { type: 'string' } })
  @IsOptional()
  @IsObject()
  authHeaders: { [key: string]: string };

  @ApiProperty()
  @IsOptional()
  trusted?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  tennantId: string;

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

export class DeprecatedDto {
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
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

  @ApiProperty({ type: 'integer', nullable: true })
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiProperty({ type: 'integer', nullable: true })
  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @ApiProperty({ type: 'integer', nullable: true })
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ApiProperty({ type: 'integer', nullable: true })
  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  defaultValue?: any;

  @ApiProperty({ nullable: true })
  @IsOptional()
  allowedValues?: any[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  isDeprecated?: DeprecatedDto;
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

  @ApiProperty({ nullable: true })
  @IsObject()
  logoSvg?: string;

  @ApiProperty({ nullable: true })
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

  @ApiProperty({ nullable: true })
  @IsOptional()
  isDeprecated?: DeprecatedDto;
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

  @ApiProperty({ additionalProperties: { nullable: true } })
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

  @ApiProperty({ additionalProperties: { nullable: true } })
  @IsObject()
  properties: PropertyValues;
}

export class SendRequestDto extends BaseRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ additionalProperties: { nullable: true } })
  @IsObject()
  properties: PropertyValues;

  @ApiProperty()
  @IsObject()
  user: UserDto;

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

  @ApiProperty({ nullable: true })
  @IsDefined()
  fromEmail?: string;

  @ApiProperty()
  @IsOptional()
  fromName?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  bodyText?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  bodyHtml?: string;
}

@ApiExtraModels(EmailPayloadDto)
export class SendEmailRequestDto extends SendRequestDto {
  @ApiProperty()
  @IsObject()
  payload: EmailPayloadDto;
}

export class SmsPayloadDto {
  @ApiProperty()
  @IsNotEmpty()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  body: string;
}

@ApiExtraModels(SmsPayloadDto)
export class SendSmsRequestDto extends SendRequestDto {
  @ApiProperty()
  @IsObject()
  payload: SmsPayloadDto;
}

export class WebhookRequestDto extends BaseRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ additionalProperties: { nullable: true } })
  @IsObject()
  properties: PropertyValues;

  @IsDefined()
  @IsEnum(HttpMethod)
  method: HttpMethod;

  @ApiProperty({
    additionalProperties: { type: 'array', items: { type: 'string' } },
  })
  @IsDefined()
  @IsObject()
  query: { [key: string]: string[] };

  @ApiProperty({
    additionalProperties: { type: 'string' },
  })
  @IsDefined()
  @IsObject()
  headers: { [key: string]: string };

  @ApiProperty({ nullable: true })
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

  @ApiProperty({ nullable: true })
  field?: string;
}

export class ApiErrorDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(ErrorDto) },
  })
  @IsOptional()
  errors: ErrorDto[];
}

@ApiExtraModels(ErrorDto)
export class NotificationStatusDto {
  @ApiProperty({ enum: NotificationStatus })
  @IsNotEmpty()
  @IsString()
  status: NotificationStatus;

  @ApiProperty()
  @IsOptional()
  notificationId?: string;

  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(ErrorDto) },
    nullable: true,
  })
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

export class WebhookHttpResponseDto {
  @ApiProperty({ type: 'integer', nullable: true })
  @IsDefined()
  @IsNumber()
  statusCode?: number;

  @ApiProperty({
    additionalProperties: { type: 'string' },
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  headers?: { [key: string]: string };

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  body?: string;
}

export class WebhookResponseDto {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  http?: WebhookHttpResponseDto;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  status?: NotificationStatusDto;
}
