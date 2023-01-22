import { SmtpProvider } from './smtp/smtp-provider';
export * from './interface';

export const Providers = {
  provide: 'PROVIDERS',
  useFactory: () => [new SmtpProvider()],
};
