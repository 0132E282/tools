import { GoogleLoginController } from './google-login.controller.js';
import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller.js';
import { CalendarService } from './calendar.service.js';
import { CalendarSessionService } from './calendar-session.service.js';

@Module({
  controllers: [CalendarController, GoogleLoginController],
  providers: [CalendarService, CalendarSessionService],
})
export class CalendarModule {}
