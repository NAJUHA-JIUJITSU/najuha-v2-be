import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TEntitytype, TUserCredential } from '../../../modules/view-count/domain/view-count.interface';
import { TId } from '../../../common/common-types';
import appEnv from '../../../common/app-env';

@Injectable()
export class ViewCountHistoryProvider {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(userCredential: TUserCredential, entityType: TEntitytype, entityId: TId): Promise<void> {
    const key = `${entityType}:${entityId}:user:${userCredential}`;
    await this.redisClient.set(key, '1', 'EX', appEnv.redisViewCountExpirationTime);
  }

  async get(userCredential: TUserCredential, entityType: TEntitytype, entityId: TId): Promise<string | null> {
    const key = `${entityType}:${entityId}:user:${userCredential}`;
    return await this.redisClient.get(key);
  }
}
