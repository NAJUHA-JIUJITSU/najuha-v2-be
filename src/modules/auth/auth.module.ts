import { Module } from '@nestjs/common';
import { UserAuthController } from 'src/modules/auth/presentation/user-auth.controller';
import { AuthService } from 'src/modules/auth/application/auth.service';
import { SnsAuthModule } from 'src/infra/sns-auth-client/sns-auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthTokenProvider } from './application/auth-token.provider';

@Module({
  imports: [UsersModule, SnsAuthModule],
  controllers: [UserAuthController],
  providers: [AuthService, AuthTokenProvider],
  exports: [AuthService, AuthTokenProvider],
})
export class AuthModule {}
