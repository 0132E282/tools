import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { CalendarService } from './calendar.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendar: CalendarService) {}

  @Get('status')
  @Header('Cache-Control', 'no-store')
  status(@Req() request: Request) {
    return this.calendar.status(request);
  }

  @Get('connect')
  async connect(@Res() response: Response) {
    response.setHeader('Cache-Control', 'no-store');
    response.redirect(await this.calendar.connect(response));
  }

  @Get('calendars')
  @Header('Cache-Control', 'no-store')
  calendars(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.calendar.calendars(request, response);
  }

  @Get(':calendarId/events')
  @Header('Cache-Control', 'no-store')
  events(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Param('calendarId') id: string,
  ) {
    return this.calendar.events(request, response, id);
  }

  @Post(':calendarId/events')
  @Header('Cache-Control', 'no-store')
  create(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Param('calendarId') id: string,
    @Body() dto: CreateEventDto,
  ) {
    return this.calendar.create(request, response, id, dto);
  }

  @Post('logout')
  @Header('Cache-Control', 'no-store')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.calendar.logout(request, response);
  }
}
