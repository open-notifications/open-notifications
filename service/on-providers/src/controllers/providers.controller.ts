import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiErrorDto,
  GetProvidersRequestDto,
  GetProvidersResponseDto,
  InstallationRequestDto,
} from 'src/dtos';
import { ApiTags, ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from 'src/services/providers.service';
import type { Response } from 'express';

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

  @Get('image/:providerId')
  @ApiOperation({ summary: 'Return the image for a provider.' })
  @ApiParam({
    name: 'providerId',
    type: 'string',
    description: 'The ID of the provider',
  })
  @ApiResponse({
    status: 200,
    description: 'Provider image returned.',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Provider or image not found.',
  })
  @HttpCode(200)
  async downloadImage(
    @Param('providerId') providerId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.providers.image(providerId);

    if (result) {
      response.set({
        'Content-Type': result.contentType,
      });

      return new StreamableFile(result.file);
    }

    throw new NotFoundException('Provider does not return an image.');
  }
}
