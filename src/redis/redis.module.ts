// 예시: redis.module.ts
import { Module } from '@nestjs/common';
import Redis from 'ioredis';

// TODO: 환경변수로 관환
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useValue: new Redis({
        host: 'localhost', // Docker Compose에서 정의한 Redis 호스트
        port: 6379, // Docker Compose에서 정의한 Redis 포트
      }),
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
