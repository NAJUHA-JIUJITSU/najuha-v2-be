import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SnsAuthModule } from '../sns-auth/sns-auth.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule, UsersModule, SnsAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
