import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailRequestDto, SendResponseDto } from 'src/dtos';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProvidersService } from 'src/services/providers.service';

@Controller('send')
@ApiTags('providers')
export class SendController {
  constructor(private readonly providers: ProvidersService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send an email message.' })
  @ApiResponse({
    status: 200,
    description: 'Email message sent.',
    type: SendResponseDto,
  })
  sendEmail(@Body() request: SendEmailRequestDto) {
    return this.providers.sendEmail(request);
  }

  @Post('sms')
  @ApiOperation({ summary: 'Send an Sms message.' })
  @ApiResponse({
    status: 200,
    description: 'Sms sent sent.',
    type: SendResponseDto,
  })
  sendSms(@Body() request: SendEmailRequestDto) {
    return this.providers.sendEmail(request);
  }
}
