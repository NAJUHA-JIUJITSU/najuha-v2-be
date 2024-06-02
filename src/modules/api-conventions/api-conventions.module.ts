import { Module } from '@nestjs/common';
import { ApiConventionsController } from './presentation/api-conventions.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ApiConventionsController],
})
export class ApiConventionsModule {}
