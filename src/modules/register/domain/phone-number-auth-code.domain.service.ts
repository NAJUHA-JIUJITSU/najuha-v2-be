import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PhoneNumberAuthCode } from './interface/phone-number-auth-code.type';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import typia from 'typia';
import appEnv from 'src/common/app-env';

@Injectable()
export class PhoneNumberAuthCodeDomainService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async issuePhoneNumberAuthCode(userId: IUser['id'], phoneNumber: IUser['phoneNumber']): Promise<PhoneNumberAuthCode> {
    const authCode = typia.random<PhoneNumberAuthCode>();
    this.redisClient.set(
      `userId:${userId}-authCode:${authCode}`,
      phoneNumber,
      'EX',
      appEnv.redisPhoneNumberAuthCodeExpirationTime,
    );
    return authCode;
  }

  async validatePhoneNumberAuthCodeValid(
    userId: IUser['id'],
    authCode: PhoneNumberAuthCode,
  ): Promise<IUser['phoneNumber'] | null> {
    return await this.redisClient.get(`userId:${userId}-authCode:${authCode}`);
  }
}
