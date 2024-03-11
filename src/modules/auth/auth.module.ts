import { Module } from '@nestjs/common';
import { UserAuthController } from 'src/modules/auth/presentation/user-auth.controller';
import { AuthAppService } from 'src/modules/auth/application/auth.app.service';
import { SnsAuthModule } from 'src/infrastructure/sns-auth-client/sns-auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthTokenDomainService } from './domain/auth-token.domain.service';

@Module({
  imports: [UsersModule, SnsAuthModule],
  controllers: [UserAuthController],
  providers: [AuthAppService, AuthTokenDomainService],
  exports: [AuthAppService, AuthTokenDomainService],
})
export class AuthModule {}
