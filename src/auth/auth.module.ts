import { Module } from '@nestjs/common';
import { UserAuthController } from 'src/auth/user-auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { SnsAuthModule } from 'src/sns-auth/sns-auth.module';
import { UsersModule } from 'src/users/users.module';
import { AuthTokenProvider } from './auth-token.provider';

@Module({
  imports: [RedisModule, UsersModule, SnsAuthModule],
  controllers: [UserAuthController],
  providers: [AuthService, AuthTokenProvider],
  exports: [AuthService, AuthTokenProvider],
})
export class AuthModule {}
