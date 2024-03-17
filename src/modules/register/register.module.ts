import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PolicyModule } from 'src/modules/policy/policy.module';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { PolicyConsentRepository } from 'src/infrastructure/database/repository/policy-consent.repository';

@Module({
  imports: [UsersModule, AuthModule, PolicyModule],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService, PolicyConsentRepository],
  exports: [RegisterAppService],
})
export class RegisterModule {}
