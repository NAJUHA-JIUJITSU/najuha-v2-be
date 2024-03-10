import { Module, OnModuleInit, OnModuleDestroy, Inject, Global } from '@nestjs/common';
import Redis from 'ioredis';
import appEnv from '../../common/app-env';

/**
 * nestjs provider 생명주기 메서드를 사용해서 Redis 클라이언트를 생성하고 종료하는 방법
 * - onModuleInit: 모듈이 초기화될 때 호출되는 메서드
 * - onModuleDestroy: 모듈이 종료될 때 호출되는 메서드
 * 위와 같은 처리를 안해주면 테스트시 redis 연결이 끊기지 않아서 테스트가 종료돠지 않음.
 *
 * TODO: redis 보안 연결 설정하기
 */
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: appEnv.redisHost,
          port: appEnv.redisPort,
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
