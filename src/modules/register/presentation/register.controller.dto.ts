import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  ConfirmAuthCodeRet,
  GetTemporaryUserRet,
  IsDuplicateNicknameRet,
  RegisterUserRet,
  SendPhoneNumberAuthCodeRet,
} from '../application/register.app.dto';
import { PhoneNumberAuthCode } from '../domain/interface/phone-number-auth-code.type';

// ---------------------------------------------------------------------------
// registerController Request
// ---------------------------------------------------------------------------
export interface SendPhoneNumberAuthCodeReqBody {
  phoneNumber: IUser['phoneNumber'];
}

export interface ConfirmAuthCodeReqBody {
  authCode: PhoneNumberAuthCode;
}

export interface RegisterUserReqBody {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: IPolicy['type'][];
}

// ---------------------------------------------------------------------------
// registerController Response
// ---------------------------------------------------------------------------
export interface GetTemporaryUserRes extends GetTemporaryUserRet {}

export interface IsDuplicatedNicknameRes extends IsDuplicateNicknameRet {}

export interface SendPhoneNumberAuthCodeRes extends SendPhoneNumberAuthCodeRet {}

export interface ConfirmAuthCodeRes extends ConfirmAuthCodeRet {}

export interface RegisterUserRes extends RegisterUserRet {}
