import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service.js';
import { adminPage } from './admin.page.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('admin')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getAdmin(): string {
    return adminPage;
  }
}
