import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendEmailDto } from 'src/dtos';
import { ProvidersService } from 'src/services/providers.service';

@Controller('send')
export class SendController {
  constructor(private readonly providers: ProvidersService) {}

  @Post('email')
  sendEmail(@Body() request: SendEmailDto) {
    return this.providers.sendEmail(request);
  }

  @Post('sms')
  sendSms(@Body() request: SendEmailDto) {
    return this.providers.sendEmail(request);
  }
}
