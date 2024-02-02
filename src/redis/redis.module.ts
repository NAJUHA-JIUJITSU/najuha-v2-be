import { Module, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import appConfig from '../common/appConfig';

/**
 * nestjs provider 생명주기 메서드를 사용해서 Redis 클라이언트를 생성하고 종료하는 방법
 *
 * TODO: redis 보안 연결 설정하기
 */
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: appConfig.redisHost,
          port: appConfig.redisPort,
        });

        // client.on('connect', () => console.log('Connected to Redis'));
        // client.on('error', (err) => console.log('Redis Error', err));

        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  onModuleInit() {
    // console.log('RedisModule initialized');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    // console.log('Redis client connection closed');
  }
}
