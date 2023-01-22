import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Providers } from './providers';
import { ProvidersService } from './services/providers.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ProvidersService, Providers],
})
export class AppModule {}
