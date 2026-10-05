import { NestFactory } from '@nestjs/core';
import { fileURLToPath } from 'node:url';
import type { Server } from 'node:http';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module.js';
import { configureApp } from './configure-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  if (process.env.TOOLS_CLIENT_DEV === 'true') {
    const { createServer } = await import('vite');
    const server: Server = app.getHttpServer();
    const vite = await createServer({
      root: fileURLToPath(new URL('../../Client', import.meta.url)),
      server: { middlewareMode: true, hmr: { server } },
    });
    app.use((request: Request, response: Response, next: NextFunction) => {
      if (request.path === '/api' || request.path.startsWith('/api/')) {
        next();
        return;
      }
      vite.middlewares(request, response, next);
    });
    server.on('close', () => {
      void vite.close().catch((error: unknown) => console.error(error));
    });
    app.enableShutdownHooks();
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap().catch((error: unknown) => {
  console.error('Failed to start NestJS application:', error);
  process.exitCode = 1;
});
