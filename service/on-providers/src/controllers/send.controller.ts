import { Body, Controller, Post } from '@nestjs/common';
import {
  SendEmailRequestDto,
  NotificationStatusDto,
  ApiErrorDto,
} from 'src/dtos';
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
    type: NotificationStatusDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Properties not valid.',
    type: ApiErrorDto,
  })
  sendEmail(@Body() request: SendEmailRequestDto) {
    return this.providers.sendEmail(request);
  }

  @Post('sms')
  @ApiOperation({ summary: 'Send an Sms message.' })
  @ApiResponse({
    status: 200,
    description: 'Sms sent sent.',
    type: NotificationStatusDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Properties not valid.',
    type: ApiErrorDto,
  })
  sendSms(@Body() request: SendEmailRequestDto) {
    return this.providers.sendEmail(request);
  }
}
