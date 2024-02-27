import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UserRegisterController } from './user-register.controller';
import { RegisterService } from './register.service';
import { AuthModule } from 'src/auth/auth.module';
import { PolicyModule } from 'src/policy/policy.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule, UsersModule, AuthModule, PolicyModule],
  controllers: [UserRegisterController],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
