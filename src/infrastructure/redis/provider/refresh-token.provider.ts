import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import appEnv from '../../../common/app-env';

@Injectable()
export class RefreshTokenProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(userId: string, refreshToken: string): Promise<void> {
    await this.redisClient.set(
      `userId:${userId}:refreshToken`,
      refreshToken,
      'EX',
      appEnv.redisRefreshTokenExpirationTime,
    );
  }

  async get(userId: string): Promise<string | null> {
    return this.redisClient.get(`userId:${userId}:refreshToken`);
  }

  async del(userId: string): Promise<void> {
    await this.redisClient.del(`userId:${userId}:refreshToken`);
  }

  // todo!: 지워야함
  async testPrintAllRedisData(message: string) {
    console.log(`[TEST REDIS] ${message}--------------------------------`);

    const keys = await this.redisClient.keys('*');

    const keyValuePairs = await Promise.all(
      keys.map(async (key) => {
        const value = await this.redisClient.get(key);
        return { key, value };
      }),
    );

    keyValuePairs.forEach((pair) => {
      console.log(`${pair.key}: ${pair.value}`);
    });
  }
}
