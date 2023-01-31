import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isBoolean, isDefined, isNumber, isString } from 'class-validator';
import {
  ApiErrorDto,
  ErrorCode,
  GetProvidersRequestDto,
  GetProvidersResponseDto,
  InstallationRequestDto,
  PropertyType,
  PropertyValues,
  ProviderType,
  RequestContextDto,
  SendEmailRequestDto,
  SendSmsRequestDto,
  WebhookRequestDto,
} from './../dtos';
import { Provider, Providers } from './../providers';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProvidersService.name);
  private readonly providerMap: { [name: string]: Provider } = {};

  constructor(@Inject(Providers.provide) providers: Provider[]) {
    for (const provider of providers) {
      this.providerMap[provider.name] = provider;
    }
  }

  getAllProviders(request: GetProvidersRequestDto) {
    const result = new GetProvidersResponseDto();
    result.providers = {};

    for (const [name, provider] of Object.entries(this.providerMap)) {
      result.providers[name] = provider.getSpec(request.context);
    }

    return result;
  }

  async install(request: InstallationRequestDto) {
    const provider = this.getProvider(request.provider);
    this.validateProperties(request.context, provider, request.properties);

    if (provider.install) {
      try {
        await provider.install(request);
      } catch (ex) {
        this.logger.error('Installation failed', ex);

        throw new BadRequestException({
          message: 'Installation failed, very likely due to bad credentials',
          statusCode: 400,
        });
      }
    }
  }

  async uninstall(request: InstallationRequestDto) {
    const provider = this.getProvider(request.provider);
    this.validateProperties(request.context, provider, request.properties);

    if (provider.uninstall) {
      await provider.uninstall(request);
    }
  }

  async handleWebhook(request: WebhookRequestDto) {
    const provider = this.getProvider(request.provider);

    if (provider.handleWebhook) {
      await provider.handleWebhook(request);
    }
  }

  sendSms(request: SendSmsRequestDto) {
    const provider = this.getProvider(request.provider);
    this.validateProperties(request.context, provider, request.properties);
    this.validateProvider(request.context, provider, ProviderType.SMS);

    if (!provider.sendSms) {
      throw new BadRequestException({
        message: 'Provider does not implement sendSms',
        statusCode: 400,
      });
    }

    return provider.sendSms(request);
  }

  async sendEmail(request: SendEmailRequestDto) {
    const provider = this.getProvider(request.provider);
    this.validateProperties(request.context, provider, request.properties);
    this.validateProvider(request.context, provider, ProviderType.EMAIL);

    if (!provider.sendEmail) {
      throw new BadRequestException({
        message: 'Provider does not implement sendEmail',
        statusCode: 400,
      });
    }

    return provider.sendEmail(request);
  }

  private getProvider(name: string) {
    if (!name) {
      throw new BadRequestException({
        message: 'Provider name cannot be null or undefined',
        statusCode: 400,
      });
    }

    const provider = this.providerMap[name];

    if (!provider) {
      throw new NotFoundException({
        message: 'Provider not found',
        statusCode: 400,
      });
    }

    return provider;
  }

  private validateProvider(
    context: RequestContextDto,
    provider: Provider,
    type: ProviderType,
  ) {
    const spec = provider.getSpec(context);

    if (spec.type !== type) {
      throw new BadRequestException({
        message: `Provider type is '${spec.type}', expected '${type}'.`,
        statusCode: 400,
      });
    }
  }

  private validateProperties(
    context: RequestContextDto,
    provider: Provider,
    properties: PropertyValues,
  ) {
    const spec = provider.getSpec(context);

    const apiError = new ApiErrorDto();
    apiError.code = ErrorCode.VALIDATION_ERROR;
    apiError.details = [];
    apiError.message = 'Validation Error';
    apiError.statusCode = 400;

    for (const [field, propertyInfo] of Object.entries(spec.properties)) {
      const value = properties[field];

      if (propertyInfo.required && !isDefined(value)) {
        apiError.details.push({
          code: ErrorCode.PROPERTY_NOT_DEFINED,
          field,
          message: `${field} should not be null or undefined`,
        });
      }
    }

    for (const [field, value] of Object.entries(properties)) {
      const propertyInfo = spec.properties[field];

      if (!propertyInfo) {
        apiError.details.push({
          code: ErrorCode.PROPERTY_NOT_KNOWN,
          field,
          message: `${field} is not a known property`,
        });
        continue;
      }

      switch (propertyInfo.type) {
        case PropertyType.NUMBER:
          if (!isNumber(value)) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_TYPE_MISMATCH,
              field,
              message: `${field} must be a number, got '${typeof value}'`,
            });
            continue;
          }

          if (
            isNumber(propertyInfo.minValue) &&
            value < propertyInfo.minValue
          ) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_MINVALUE_ERROR,
              field,
              message: `${field} must not be less than ${propertyInfo.minValue}`,
            });
          }

          if (
            isNumber(propertyInfo.maxValue) &&
            value > propertyInfo.maxValue
          ) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_MAXVALUE_ERROR,
              field,
              message: `${field} must not be greater than ${propertyInfo.minValue}`,
            });
          }

          break;

        case PropertyType.BOOLEAN:
          if (!isBoolean(value)) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_TYPE_MISMATCH,
              field,
              message: `${field} must be a boolean, got '${typeof value}'`,
            });
            continue;
          }

          break;

        default:
          if (!isString(value)) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_TYPE_MISMATCH,
              field,
              message: `${field} must be a string, got '${typeof value}'`,
            });
            continue;
          }

          if (
            isNumber(propertyInfo.minLength) &&
            value.length < propertyInfo.minLength
          ) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_MINLENGTH_ERROR,
              field,
              message: `${field} must be longer than or equal to ${propertyInfo.minLength} characters`,
            });
          }

          if (
            isNumber(propertyInfo.maxLength) &&
            value.length > propertyInfo.maxLength
          ) {
            apiError.details.push({
              code: ErrorCode.PROPERTY_MAXLENGTH_ERROR,
              field,
              message: `${field} must be shorter  than or equal to ${propertyInfo.minLength} characters`,
            });
          }
      }
    }

    if (apiError.details.length > 0) {
      for (const detail of apiError.details) {
        if (detail.field) {
          detail.field = `properies.${detail.field}`;
        }
      }

      throw new BadRequestException(apiError);
    }
  }
}
