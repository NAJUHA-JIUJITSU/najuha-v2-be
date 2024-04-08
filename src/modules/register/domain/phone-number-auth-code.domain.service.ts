import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PhoneNumberAuthCode } from './interface/phone-number-auth-code.type';
import typia from 'typia';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

@Injectable()
export class PhoneNumberAuthCodeDomainService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // 발급하다
  async issueAuthCode(userId: IUser['id'], phoneNumber: IUser['phoneNumber']): Promise<PhoneNumberAuthCode> {
    const authCode = typia.random<PhoneNumberAuthCode>();
    // 레디스에 인증코드 저장 (5분)
    // TODO: 시간 정보 환경변수로 관리하기
    this.redisClient.set(`userId:${userId}-authCode:${authCode}`, phoneNumber, 'EX', 300);
    return authCode;
  }

  async isAuthCodeValid(userId: IUser['id'], authCode: PhoneNumberAuthCode): Promise<boolean> {
    const phoneNumber = await this.redisClient.get(`userId:${userId}-authCode:${authCode}`);
    if (!phoneNumber) return false;
    return true;
  }
}
