import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import appEnv from '../../../common/app-env';

@Injectable()
export class PhoneNumberAuthCodeProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(userId: string, authCode: string, phoneNumber: string): Promise<void> {
    this.redisClient.set(
      `userId:${userId}-authCode:${authCode}`,
      phoneNumber,
      'EX',
      appEnv.redisPhoneNumberAuthCodeExpirationTime,
    );
  }

  async get(userId: string, authCode: string): Promise<string | null> {
    return await this.redisClient.get(`userId:${userId}-authCode:${authCode}`);
  }
}
