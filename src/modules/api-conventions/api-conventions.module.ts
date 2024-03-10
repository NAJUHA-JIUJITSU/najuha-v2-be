import { Module } from '@nestjs/common';
import { ApiConventionsController } from './presentation/api-conventions.controller';

@Module({
  controllers: [ApiConventionsController],
})
export class ApiConventionsModule {}
