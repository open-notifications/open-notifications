import { Module } from '@nestjs/common';
import { ProvidersController } from './controllers/providers.controller';
import { SendController } from './controllers/send.controller';
import { Providers } from './providers';
import { ProvidersService } from './services/providers.service';

@Module({
  imports: [],
  controllers: [ProvidersController, SendController],
  providers: [ProvidersService, Providers],
})
export class AppModule {}
