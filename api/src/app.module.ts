import { fileURLToPath } from 'node:url';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CalendarModule } from './calendar/calendar.module.js';
import { PostsModule } from './posts/posts.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: fileURLToPath(new URL('../../.env', import.meta.url)),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbType = configService.get<string>('DB_TYPE', 'sqlite');

        if (dbType === 'mysql') {
          return {
            type: 'mysql',
            host: configService.get<string>('DB_HOST', '127.0.0.1'),
            port: Number(configService.get('DB_PORT', '3306')),
            username: configService.get<string>('DB_USER', 'root'),
            password: configService.get<string>('DB_PASSWORD', ''),
            database: configService.get<string>('DB_NAME', 'tools'),
            autoLoadEntities: true,
            synchronize: configService.get('DB_SYNCHRONIZE') !== 'false',
          } as unknown as TypeOrmModuleOptions;
        }

        // SQLite fallback / default for seamless operation on Vercel & local
        const sqlitePath =
          process.env.NODE_ENV === 'production'
            ? '/tmp/tools.sqlite'
            : './tools.sqlite';

        return {
          type: 'sqlite',
          database: sqlitePath,
          autoLoadEntities: true,
          synchronize: true,
        } as unknown as TypeOrmModuleOptions;
      },
    }),
    PostsModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
