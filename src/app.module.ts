import { Module } from '@nestjs/common';
import { JwtModule } from './infrastructure/jwt/jwt.module';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { ApiConventionsModule } from './modules/api-conventions/api-conventions.module';
import { FilterModule } from './infrastructure/filter/filter.module';
import { GuardModule } from './infrastructure/guard/guard.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MiddlewareModule } from './infrastructure/middleware/middleware.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PolicyModule } from './modules/policy/policy.module';
import { RegisterModule } from './modules/register/register.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './infrastructure/database/typeorm.config';

@Module({
  imports: [
    /**
     * Infra Modules: These modules ard used to provide the basic functionality to the application
     */
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    DatabaseModule,
    FilterModule,
    GuardModule,
    JwtModule,
    LoggerModule,
    MiddlewareModule,
    RedisModule,

    /**
     * Domain Modules: These modules arr used to provide the business logic to the application
     */
    ApiConventionsModule,
    AuthModule,
    RegisterModule,
    UsersModule,
    PolicyModule,
    CompetitionsModule,
  ],
  providers: [],
})
export class AppModule {}
