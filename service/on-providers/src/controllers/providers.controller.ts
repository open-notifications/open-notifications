import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiErrorDto,
  GetProvidersRequestDto,
  GetProvidersResponseDto,
  InstallationRequestDto,
} from 'src/dtos';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from 'src/services/providers.service';

@Controller('providers')
@ApiTags('providers')
export class ProvidersController {
  constructor(private readonly providers: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Return providers.' })
  @ApiResponse({
    status: 200,
    description: 'Providers returned.',
    type: GetProvidersResponseDto,
  })
  getProviders(@Body() request: GetProvidersRequestDto) {
    return this.providers.getAllProviders(request);
  }

  @Post('install')
  @ApiOperation({ summary: 'Install a provider.' })
  @ApiResponse({
    status: 204,
    description: 'Provider installed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Properties not valid.',
    type: ApiErrorDto,
  })
  @HttpCode(204)
  install(@Body() request: InstallationRequestDto) {
    return this.providers.install(request);
  }

  @Post('uninstall')
  @ApiOperation({ summary: 'Uninstall a provider.' })
  @ApiResponse({
    status: 204,
    description: 'Provider uninstalled.',
  })
  @HttpCode(204)
  uninstall(@Body() request: InstallationRequestDto) {
    return this.providers.uninstall(request);
  }
}
