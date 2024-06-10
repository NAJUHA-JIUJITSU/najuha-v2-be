import { Module } from '@nestjs/common';
import { ApiConventionsController } from './presentation/api-conventions.controller';
import { AuthModule } from '../auth/auth.module';
import { ApiConventionsAppService } from './application/api-conventions.app.service';

@Module({
  imports: [AuthModule],
  controllers: [ApiConventionsController],
  providers: [ApiConventionsAppService],
})
export class ApiConventionsModule {}
