import { Module } from '@nestjs/common';
import { UserAuthController } from 'src/modules/auth/presentation/user-auth.controller';
import { AuthAppService } from 'src/modules/auth/application/auth.app.service';
import { SnsAuthModule } from 'src/modules/sns-auth-client/sns-auth.module';
import { AuthTokenDomainService } from './domain/auth-token.domain.service';
import { UserFactory } from '../users/domain/user.factory';
import { DatabaseModule } from 'src//database/database.module';

@Module({
  imports: [SnsAuthModule, DatabaseModule],
  controllers: [UserAuthController],
  providers: [AuthAppService, AuthTokenDomainService, UserFactory],
  exports: [AuthTokenDomainService],
})
export class AuthModule {}
