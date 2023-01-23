import { Inject, Injectable } from '@nestjs/common';
import { isBoolean, isNumber, isString } from 'class-validator';
import {
  GetProvidersRequestDto,
  GetProvidersResponseDto,
  InstallationRequestDto,
  PropertyType,
  PropertyValues,
  ProviderType,
  RequestContextDto,
  SendEmailRequestDto,
  SendResponseDto,
  SendSmsRequestDto,
  WebhookRequestDto,
} from './../dtos';
import { Provider, Providers } from './../providers';

@Injectable()
export class ProvidersService {
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
      await provider.install(request);
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

  async sendSms(request: SendSmsRequestDto) {
    const provider = this.getProvider(request.provider);
    this.validateProperties(request.context, provider, request.properties);
    this.validateProvider(request.context, provider, ProviderType.SMS);

    if (!provider.sendSms) {
      throw new Error('Provider does not implement sendSms.');
    }

    const status = await provider.sendSms(request);

    const response = new SendResponseDto();
    response.status = status;

    return response;
  }

  async sendEmail(request: SendEmailRequestDto) {
    const provider = this.getProvider(request.provider);
    this.validateProperties(request.context, provider, request.properties);
    this.validateProvider(request.context, provider, ProviderType.EMAIL);

    if (!provider.sendEmail) {
      throw new Error('Provider does not implement sendEmail.');
    }

    const status = await provider.sendEmail(request);

    const response = new SendResponseDto();
    response.status = status;

    return response;
  }

  private getProvider(name: string) {
    if (!name) {
      throw new Error('Provider name cannot be undefined.');
    }

    const provider = this.providerMap[name];

    if (!provider) {
      throw new Error(`Cannot find provider with name '${name}'`);
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
      throw new Error(`Provider type is '${spec.type}', expected '${type}'.`);
    }
  }

  private validateProperties(
    context: RequestContextDto,
    provider: Provider,
    properties: PropertyValues,
  ) {
    const spec = provider.getSpec(context);
    const errors: { property: string; message: string }[] = [];

    for (const [property, propertyInfo] of Object.entries(spec.properties)) {
      if (propertyInfo.required && !properties[property]) {
        errors.push({ property, message: `Property must be defined.` });
      }
    }

    for (const [property, value] of Object.entries(properties)) {
      const propertyInfo = spec.properties[property];

      if (!propertyInfo) {
        errors.push({ property: property, message: 'Unknown property.' });
        continue;
      }

      switch (propertyInfo.type) {
        case PropertyType.NUMBER:
          if (!isNumber(value)) {
            errors.push({
              property: property,
              message: `Expected Number, got '${typeof value}'`,
            });
            continue;
          }

          if (
            isNumber(propertyInfo.minValue) &&
            value < propertyInfo.minValue
          ) {
            errors.push({
              property: property,
              message: `Value must be greater or equal than '${propertyInfo.minValue}'.`,
            });
          }

          if (
            isNumber(propertyInfo.maxValue) &&
            value > propertyInfo.maxValue
          ) {
            errors.push({
              property,
              message: `Value must be less or equal than '${propertyInfo.maxValue}'.`,
            });
          }

          break;

        case PropertyType.BOOLEAN:
          if (!isBoolean(value)) {
            errors.push({
              property,
              message: `Expected Boolean, got '${typeof value}'`,
            });
            continue;
          }

          break;

        default:
          if (!isString(value)) {
            errors.push({
              property,
              message: `Expected String, got '${typeof value}'`,
            });
            continue;
          }

          if (
            isNumber(propertyInfo.minLength) &&
            value.length < propertyInfo.minLength
          ) {
            errors.push({
              property: property,
              message: `Length must be greater or equal than '${propertyInfo.minLength}'.`,
            });
          }

          if (
            isNumber(propertyInfo.maxLength) &&
            value.length > propertyInfo.maxLength
          ) {
            errors.push({
              property,
              message: `Length must be less or equal than '${propertyInfo.maxLength}'.`,
            });
          }
      }
    }
  }
}
