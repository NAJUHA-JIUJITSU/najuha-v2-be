import { Module } from '@nestjs/common';
import { JwtModule } from './infrastructure/jwt/jwt.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ApiConventionsModule } from './modules/api-conventions/api-conventions.module';
import { FilterModule } from './infrastructure/filter/filter.module';
import { GuardModule } from './infrastructure/guard/guard.module';
import { MiddlewareModule } from './infrastructure/middleware/middleware.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PolicyModule } from './modules/policy/policy.module';
import { RegisterModule } from './modules/register/register.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { ApplicationModule } from './modules/applications/application.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './database/typeorm.config';
import { PostsModule } from './modules/posts/posts.module';
import { ViewCountModule } from './modules/view-count/view-count.module';
import { BucketModule } from './infrastructure/bucket/bucket.module';
import { ImagesModule } from './modules/images/images.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FakeTossModule } from './modules/fake-toss/fake-toss.module';

@Module({
  imports: [
    /**
     * Infra Modules: These modules ard used to provide the basic functionality to the application
     */
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    FilterModule,
    GuardModule,
    JwtModule,
    LoggerModule,
    MiddlewareModule,
    RedisModule,
    BucketModule,
    PaymentsModule,
    FakeTossModule,
    /**
     * Domain Modules: These modules arr used to provide the business logic to the application
     */
    ApiConventionsModule,
    AuthModule,
    RegisterModule,
    UsersModule,
    PolicyModule,
    CompetitionsModule,
    ApplicationModule,
    PostsModule,
    ViewCountModule,
    ImagesModule,
  ],
  providers: [],
})
export class AppModule {}
