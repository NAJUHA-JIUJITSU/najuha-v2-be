import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { typeOrmConfigAsync } from 'src/typeorm.config';
import { UsersModule } from 'src/users/users.module';
import { Logger } from 'winston';
import { CustomExceptionFilter } from 'src/common/exception-filters/custom-exception-filter';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env.dev',
    }),
    JwtModule.register({
      global: true,
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
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
