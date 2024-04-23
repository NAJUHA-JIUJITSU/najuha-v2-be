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
import { RegisterUserEntityFactory } from './domain/register-user.factory';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, PolicyEntity, PolicyConsentEntity])],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService, RegisterRepository, RegisterUserEntityFactory],
  exports: [RegisterAppService],
})
export class RegisterModule {}
