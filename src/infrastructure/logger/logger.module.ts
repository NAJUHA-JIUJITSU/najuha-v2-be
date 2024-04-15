import { Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            winston.format.errors({ stack: true }),
            nestWinstonModuleUtilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        ...(process.env.NODE_ENV === 'prod' // 배포 환경에서만 파일 로그를 기록합니다.
          ? [
              new DailyRotateFile({
                filename: 'logs/info/info-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                level: 'info',
                maxSize: '20m',
                maxFiles: '30d',
              }),
              new DailyRotateFile({
                filename: 'logs/error/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                maxSize: '20m',
                maxFiles: '30d',
              }),
            ]
          : []),
      ],
    }),
  ],
})
export class LoggerModule {}
