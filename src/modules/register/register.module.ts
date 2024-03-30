import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from '../../infrastructure/database/entities/policy/policy.entity';
import { PolicyConsent } from '../../infrastructure/database/entities/user/policy-consent.entity';
import { RegisterRepository } from './register.repository';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { RegisterUserFactory } from './domain/register-user.factory';
import { RegisterValidatorService } from './domain/register-validator.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, Policy, PolicyConsent])],
  controllers: [UserRegisterController],
  providers: [
    RegisterAppService,
    PhoneNumberAuthCodeDomainService,
    RegisterRepository,
    RegisterValidatorService,
    RegisterUserFactory,
  ],
  exports: [RegisterAppService],
})
export class RegisterModule {}
