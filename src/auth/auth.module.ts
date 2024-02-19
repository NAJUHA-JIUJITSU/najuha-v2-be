import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { RedisModule } from 'src/redis/redis.module';
import { SnsAuthModule } from 'src/sns-auth/sns-auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [RedisModule, UsersModule, SnsAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
