import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Logger } from 'winston';
import { HttpExceptionFilter } from './http-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useFactory: (logger: Logger) => new HttpExceptionFilter(logger),
      inject: [WINSTON_MODULE_PROVIDER],
    },
  ],
})
export class FilterModule {}
