import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { ProvidersController } from './controllers/providers.controller';
import { SendController } from './controllers/send.controller';
import { WebhookController } from './controllers/webhook.controller';
import { Providers } from './providers';
import { ProvidersService } from './services/providers.service';

@Module({
  imports: [],
  controllers: [
    HealthController,
    ProvidersController,
    SendController,
    WebhookController,
  ],
  providers: [ProvidersService, Providers],
})
export class AppModule {}
