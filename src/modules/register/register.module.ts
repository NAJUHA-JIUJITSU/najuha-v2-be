import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { PolicyConsentFactory } from './domain/policy-consent.factory';
import { RedisModule } from '../../infrastructure/redis/redis.module';

@Module({
  imports: [AuthModule, DatabaseModule, RedisModule],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService, PolicyConsentFactory],
  exports: [RegisterAppService],
})
export class RegisterModule {}
