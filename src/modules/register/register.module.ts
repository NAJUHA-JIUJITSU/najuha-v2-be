import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyEntity } from '../../infrastructure/database/entity/policy/policy.entity';
import { PolicyConsentEntity } from '../../infrastructure/database/entity/user/policy-consent.entity';
import { RegisterRepository } from './register.repository';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { RegisterUserFactory } from './domain/register-user.factory';
import { RegisterValidator } from './domain/register.validator';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, PolicyEntity, PolicyConsentEntity])],
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
