import { Body, Controller, Post } from '@nestjs/common';
import { GetProvidersRequest, InstallationRequestDto } from 'src/dtos';
import { ProvidersService } from 'src/services/providers.service';

@Controller('providers')
export class SendController {
  constructor(private readonly providers: ProvidersService) {}

  @Post()
  getProviders(@Body() request: GetProvidersRequest) {
    return this.providers.getAllProviders(request);
  }

  @Post('install')
  install(@Body() request: InstallationRequestDto) {
    return this.providers.install(request);
  }

  @Post('uninstall')
  uninstall(@Body() request: InstallationRequestDto) {
    return this.providers.uninstall(request);
  }
}
