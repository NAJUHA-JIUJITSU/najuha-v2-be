import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { typeOrmConfigAsync } from 'src/typeorm.config';
import { UsersModule } from 'src/users/users.module';
import { Logger } from 'winston';
import { CustomExceptionFilter } from 'src/common/exception-filters/custom-exception-filter';
import { PolicyModule } from './policy/policy.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [
    LoggerModule,
    JwtModule.register({
      global: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    RegisterModule,
    UsersModule,
    PolicyModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useFactory: (logger: Logger) => new CustomExceptionFilter(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
