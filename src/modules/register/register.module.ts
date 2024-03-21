import { Module } from '@nestjs/common';
import { UserRegisterController } from './presentation/user-register.controller';
import { RegisterAppService } from './application/register.app.service';
import { PhoneNumberAuthCodeDomainService } from './domain/phone-number-auth-code.domain.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserRegisterController],
  providers: [RegisterAppService, PhoneNumberAuthCodeDomainService],
  exports: [RegisterAppService],
})
export class RegisterModule {}
