import { Body, Controller, Post } from '@nestjs/common';
import { WebhookRequestDto, WebhookResponseDto } from 'src/dtos';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from 'src/services/providers.service';

@Controller('webhook')
@ApiTags('webhook')
export class WebhookController {
  constructor(private readonly providers: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Handles a webhook.' })
  @ApiResponse({
    status: 200,
    description: 'Webhook handled.',
    type: WebhookResponseDto,
  })
  handleWebhook(@Body() request: WebhookRequestDto) {
    return this.providers.handleWebhook(request);
  }
}
