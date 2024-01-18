import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { SnsAuthModule } from '../sns-auth/sns-auth.module';

@Module({
  imports: [JwtModule, UsersModule, SnsAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
