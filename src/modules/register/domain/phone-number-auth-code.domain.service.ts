import { Injectable } from '@nestjs/common';
import { PhoneNumberAuthCode } from './interface/phone-number-auth-code.type';
import { IUser } from '../../users/domain/interface/user.interface';
import { PhoneNumberAuthCodeProvider } from '../../../infrastructure/redis/provider/phone-number-auth-code.provider';
import typia from 'typia';

@Injectable()
export class PhoneNumberAuthCodeDomainService {
  constructor(private readonly phoneNumberAuthCodeProvider: PhoneNumberAuthCodeProvider) {}

  async issuePhoneNumberAuthCode(userId: IUser['id'], phoneNumber: IUser['phoneNumber']): Promise<PhoneNumberAuthCode> {
    const authCode = typia.random<PhoneNumberAuthCode>();
    await this.phoneNumberAuthCodeProvider.set(userId, authCode, phoneNumber);
    return authCode;
  }

  async validatePhoneNumberAuthCodeValid(
    userId: IUser['id'],
    authCode: PhoneNumberAuthCode,
  ): Promise<IUser['phoneNumber'] | null> {
    return await this.phoneNumberAuthCodeProvider.get(userId, authCode);
  }
}
