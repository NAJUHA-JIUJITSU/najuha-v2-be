import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { Logger } from 'winston';
import { CustomExceptionFilter } from './exeption-filters/custom-exception-filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { typeOrmConfigAsync } from './typeorm.config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env.dev',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: (logger: Logger) => new CustomExceptionFilter(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
