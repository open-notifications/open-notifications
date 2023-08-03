import {
  IsArray,
  IsBoolean,
  isDefined,
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
  PROPERTY_MAXLENGTH_ERROR = 'property_maxlength_error',
  PROPERTY_MAXVALUE_ERROR = 'property_maxvalue_error',
  PROPERTY_MINLENGTH_ERROR = 'property_minlength_error',
  PROPERTY_MINVALUE_ERROR = 'property_minvalue_error',
  PROPERTY_NOT_DEFINED = 'property_not_defined',
  PROPERTY_NOT_KNOWN = 'property_not_known',
  PROPERTY_TYPE_MISMATCH = 'property_type_mismatch',
  VALIDATION_ERROR = 'validation_error',
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
  @IsString()
  hostUrl: string;

  @ApiProperty({ additionalProperties: { type: 'string' } })
  @IsOptional()
  @IsObject()
  authHeaders: { [key: string]: string };

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  trusted?: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tennantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class BaseRequestDto {
  @ApiProperty()
  @IsObject()
  @IsDefined()
  context: RequestContextDto;
}

export class GetProvidersRequestDto extends BaseRequestDto {
  // Empty
}

export class DeprecatedDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
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
  summary?: boolean;

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
  @IsArray()
  allowedValues?: any[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  isDeprecated?: DeprecatedDto;
}

@ApiExtraModels(PropertyInfoDto)
export class ProviderInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty({
    additionalProperties: { type: 'string' },
  })
  @IsNotEmpty()
  @IsObject()
  description: LocalizedString;

  @ApiProperty({ nullable: true })
  @IsString()
  logoSvg?: string;

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
  @IsString()
  provider: string;

  @ApiProperty({ additionalProperties: { nullable: true } })
  @IsObject()
  properties: PropertyValues;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  webhookUrl: string;
}

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ additionalProperties: { nullable: true } })
  @IsObject()
  properties: PropertyValues;
}

export class SendRequestDto extends BaseRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiProperty({ additionalProperties: { nullable: true } })
  @IsObject()
  properties: PropertyValues;

  @ApiProperty()
  @IsObject()
  user: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingWebhookUrl: string;
}

export class EmailPayloadDto {
  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({ nullable: true })
  @IsDefined()
  @IsString()
  fromEmail?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fromName?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  bodyText?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
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
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
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
  @IsString()
  provider: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingToken: string;

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
  code?: ErrorCode;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  field?: string;
}

export class ApiErrorDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(ErrorDto) },
  })
  @IsOptional()
  @IsArray()
  details?: ErrorDto[];

  @ApiProperty({
    enum: ErrorCode,
  })
  @IsDefined()
  @IsEnum(ErrorCode)
  code?: ErrorCode;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  statusCode: number;
}

@ApiExtraModels(ErrorDto)
export class NotificationStatusDto {
  @ApiProperty({ enum: NotificationStatus })
  @IsNotEmpty()
  @IsString()
  status: NotificationStatus;

  @ApiProperty({ required: true })
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingToken: string;

  @ApiProperty({
    type: 'array',
    items: { $ref: getSchemaPath(ErrorDto) },
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  errors?: ErrorDto[];

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  detail?: string;

  static status(
    status: NotificationStatus,
    trackingToken: string,
    detail?: string,
  ) {
    const result = new NotificationStatusDto();
    result.status = status;
    result.trackingToken = trackingToken;
    result.detail = detail;

    return result;
  }

  static errors(errors: ErrorDto[], trackingToken: string) {
    const result = new NotificationStatusDto();
    result.errors = errors;
    result.trackingToken = trackingToken;

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
