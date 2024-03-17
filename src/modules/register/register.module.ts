import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { PolicyConsentRepository } from 'src/infrastructure/database/repository/policy-consent.repository';
import { UserRepository } from 'src/infrastructure/database/repository/user.repository';
import { PolicyRepository } from 'src/infrastructure/database/repository/policy.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserRegisterController],
  providers: [
    UserRepository,
    PolicyRepository,
    PolicyConsentRepository,
    RegisterAppService,
    PhoneNumberAuthCodeDomainService,
  ],
  exports: [RegisterAppService],
})
export class RegisterModule {}
