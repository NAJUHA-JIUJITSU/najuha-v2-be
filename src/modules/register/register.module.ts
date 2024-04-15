import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyTable } from '../../infrastructure/database/tables/policy/policy.entity';
import { PolicyConsentTable } from '../../infrastructure/database/tables/user/policy-consent.entity';
import { RegisterRepository } from './register.repository';
import { UserTable } from '../../infrastructure/database/tables/user/user.entity';
import { RegisterUserFactory } from './domain/register-user.factory';
import { RegisterValidator } from './domain/register.validator';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserTable, PolicyTable, PolicyConsentTable])],
  controllers: [UserRegisterController],
  providers: [
    RegisterAppService,
    PhoneNumberAuthCodeDomainService,
    RegisterRepository,
    RegisterValidator,
    RegisterUserFactory,
  ],
  exports: [RegisterAppService],
})
export class RegisterModule {}
