import { NestFactory } from '@nestjs/core';
import express, { type Request, type Response, type Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap(): Promise<Express> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  configureApp(app);
  await app.init();
  return server;
}

let application: Promise<Express> | undefined;

export default async function handler(request: Request, response: Response) {
  application ??= bootstrap().catch((error: unknown) => {
    application = undefined;
    throw error;
  });
  const server = await application;
  server(request, response);
}
