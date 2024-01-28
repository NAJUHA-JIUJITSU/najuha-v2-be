import { Module, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const client = new Redis({
          host: REDIS_HOST,
          port: REDIS_PORT,
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
