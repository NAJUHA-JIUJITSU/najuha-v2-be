import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRootAsync(typeOrmConfigAsync)],
})
export class DatabaseModule {}
