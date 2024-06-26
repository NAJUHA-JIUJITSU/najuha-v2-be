import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../../database/database.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { RegistrationValidatorDomainService } from './domain/registration-validator.domain.service';
import { UserFactory } from '../users/domain/user.factory';

@Module({
  imports: [AuthModule, DatabaseModule, RedisModule],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService, RegistrationValidatorDomainService, UserFactory],
  exports: [RegisterAppService],
})
export class RegisterModule {}
