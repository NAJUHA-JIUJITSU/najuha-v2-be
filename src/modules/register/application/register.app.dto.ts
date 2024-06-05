import { ITemporaryUser, IUser, IUserRgistertDto } from 'src/modules/users/domain/interface/user.interface';
import { PhoneNumberAuthCode } from '../domain/interface/phone-number-auth-code.type';
import { IAuthTokens } from 'src/modules/auth/domain/interface/auth-tokens.interface';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';

// ---------------------------------------------------------------------------
// registerAppService Param
// ---------------------------------------------------------------------------
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
  userRegisterDto: IUserRgistertDto;
  consentPolicyTypes: IPolicy['type'][];
}

// ---------------------------------------------------------------------------
// registerAppService Result
// ---------------------------------------------------------------------------
export interface GetTemporaryUserRet {
  user: ITemporaryUser;
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
