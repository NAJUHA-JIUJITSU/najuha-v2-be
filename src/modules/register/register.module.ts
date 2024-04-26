import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';
import { RegisterUserEntityFactory } from './domain/register-user.factory';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService, RegisterUserEntityFactory],
  exports: [RegisterAppService],
})
export class RegisterModule {}
