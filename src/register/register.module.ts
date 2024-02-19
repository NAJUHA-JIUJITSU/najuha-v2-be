import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [RegisterController],
  providers: [RegisterService],
  exports: [RegisterService],
})
export class RegisterModule {}
