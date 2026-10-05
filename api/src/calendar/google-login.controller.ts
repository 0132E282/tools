import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CalendarService } from './calendar.service.js';

@Controller('login/google')
export class GoogleLoginController {
  constructor(private readonly calendar: CalendarService) {}

  @Get('callback')
  async callback(@Req() request: Request, @Res() response: Response) {
    response.setHeader('Cache-Control', 'no-store');
    try {
      await this.calendar.callback(request, response);
      response.redirect('/?calendar=connected#/admin/calendar');
    } catch {
      response.redirect('/?calendar=error#/admin/calendar');
    }
  }
}
