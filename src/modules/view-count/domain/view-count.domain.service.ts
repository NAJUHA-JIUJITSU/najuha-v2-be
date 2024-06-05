import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { TEntitytype, TUserCredential } from './view-count.interface';
import { TId } from 'src/common/common-types';
import appEnv from 'src/common/app-env';

@Injectable()
export class ViewCountDomainService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async canIncrementViewCount(
    userCredential: TUserCredential,
    entityType: TEntitytype,
    entityId: TId,
  ): Promise<boolean> {
    const key = `${entityType}:${entityId}:user:${userCredential}`;
    console.log(key);
    const hasViewed = await this.redisClient.get(key);
    console.log(hasViewed);
    return !hasViewed;
  }

  async setViewCountIncremented(
    userCredential: TUserCredential,
    entityType: TEntitytype,
    entityId: TId,
  ): Promise<void> {
    const key = `${entityType}:${entityId}:user:${userCredential}`;
    await this.redisClient.set(key, '1', 'EX', appEnv.redisViewCountExpirationTime);
  }
}
