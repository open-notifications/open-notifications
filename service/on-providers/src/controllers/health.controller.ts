import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('health')
@ApiTags('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check.' })
  @ApiResponse({
    status: 204,
    description: 'Server healthy.',
  })
  @HttpCode(204)
  health() {
    return;
  }
}
