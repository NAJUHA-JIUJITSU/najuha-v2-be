import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { PhoneNumberAuthCode } from '../domain/interface/phone-number-auth-code.type';
import { IAuthTokens } from 'src/modules/auth/domain/interface/auth-tokens.interface';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';

// Application layer Param DTOs
export interface GetTemporaryUserParam {
  userId: IUser['id'];
}

export interface IsDuplicateNicknameParam {
  userId: IUser['id'];
  nickname: string;
}

export interface SendPhoneNumberAuthCodeParam {
  userId: IUser['id'];
  phoneNumber: IUser['phoneNumber'];
}

export interface ConfirmAuthCodeParam {
  userId: IUser['id'];
  authCode: PhoneNumberAuthCode;
}

export interface RegisterUserParam {
  userRegisterDto: IUser.Dto.Register;
  consentPolicyTypes: IPolicy['type'][];
}

// Application layer Result DTOs
export interface GetTemporaryUserRet {
  user: IUser.Entity.TemporaryUser;
}

export interface IsDuplicateNicknameRet {
  isDuplicated: boolean;
}

export interface SendPhoneNumberAuthCodeRet {
  phoneNumberAuthCode: PhoneNumberAuthCode;
}

export interface ConfirmAuthCodeRet {
  isConfirmed: boolean;
}

export interface RegisterUserRet {
  authTokens: IAuthTokens;
}
