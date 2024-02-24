import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { UserRegisterController } from './user-register.controller';
import { RegisterService } from './register.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [UserRegisterController],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
