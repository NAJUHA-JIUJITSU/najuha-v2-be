import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/entities/user.entity';
import { Policy } from '../policy/domain/entities/policy.entity';
import { PolicyConsent } from '../users/domain/entities/policy-consent.entity';
import { RegisterRepository } from './register.repository';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Policy, PolicyConsent])],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService, RegisterRepository],
  exports: [RegisterAppService],
})
export class RegisterModule {}
