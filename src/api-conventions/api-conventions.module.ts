import { Module } from '@nestjs/common';
import { ApiConventionsController } from './api-conventions.controller';

@Module({
  controllers: [ApiConventionsController],
})
export class ApiConventionsModule {}
