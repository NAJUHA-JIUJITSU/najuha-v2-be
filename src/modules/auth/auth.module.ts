import { Module } from '@nestjs/common';
import { UserAuthController } from './presentation/user-auth.controller';
import { AuthAppService } from './application/auth.app.service';
import { SnsAuthModule } from '../sns-auth-client/sns-auth.module';
import { AuthTokenDomainService } from './domain/auth-token.domain.service';
import { UserFactory } from '../users/domain/user.factory';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [SnsAuthModule, DatabaseModule],
  controllers: [UserAuthController],
  providers: [AuthAppService, AuthTokenDomainService, UserFactory],
  exports: [AuthTokenDomainService],
})
export class AuthModule {}
