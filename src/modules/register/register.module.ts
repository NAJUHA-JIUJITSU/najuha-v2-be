import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterService } from './application/register.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PolicyModule } from 'src/modules/policy/policy.module';
import { PhoneNumberAuthCodeProvider } from './application/pooneNumberAuthCode.provider';
import { PolicyConsentRepository } from 'src/infra/database/repositories/policy-consent.repository';

@Module({
  imports: [UsersModule, AuthModule, PolicyModule],
  controllers: [UserRegisterController],
  providers: [RegisterService, PhoneNumberAuthCodeProvider, PolicyConsentRepository],
  exports: [RegisterService],
})
export class RegisterModule {}
