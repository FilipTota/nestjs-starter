import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';
import { TransformResponseInterceptor } from './interceptors/transform-response/transform-response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerService } from './logger/logger.service';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { DatabaseService } from '../../prisma/database.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache/cache.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const username = config.get('redis.username') as string;
        const password = config.get('redis.password') as string;
        return {
          store: redisStore,
          host: config.get('redis.host'),
          port: config.get('redis.port'),
          ...(username && { username }),
          ...(password && { password }),
          ttl: 10,
          no_ready_check: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
    LoggerService,
    DatabaseService,
    CacheService,
  ],
  exports: [LoggerService, DatabaseService, CacheService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
