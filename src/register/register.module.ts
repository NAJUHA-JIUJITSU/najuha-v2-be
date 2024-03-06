import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UserRegisterController } from './user-register.controller';
import { RegisterService } from './register.service';
import { AuthModule } from 'src/auth/auth.module';
import { PolicyModule } from 'src/policy/policy.module';
import { RedisModule } from 'src/redis/redis.module';
import { PolicyConsentModule } from 'src/policy-consents/policy-consents.module';
import { PhoneNumberAuthCodeProvider } from './pooneNumberAuthCode.provider';

@Module({
  imports: [RedisModule, UsersModule, AuthModule, PolicyModule, PolicyConsentModule],
  controllers: [UserRegisterController],
  providers: [RegisterService, PhoneNumberAuthCodeProvider],
  exports: [RegisterService],
})
export class RegisterModule {}
