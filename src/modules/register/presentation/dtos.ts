import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  ConfirmAuthCodeParam,
  ConfirmAuthCodeRet,
  GetTemporaryUserRet,
  IsDuplicateNicknameRet,
  RegisterUserRet,
  SendPhoneNumberAuthCodeParam,
  SendPhoneNumberAuthCodeRet,
} from '../application/dtos';

// Presentation Layer Request DTOs
export interface SendPhoneNumberAuthCodeReqBody extends Pick<SendPhoneNumberAuthCodeParam, 'phoneNumber'> {}

export interface ConfirmAuthCodeReqBody extends Pick<ConfirmAuthCodeParam, 'authCode'> {}

export interface RegisterUserReqBody {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: IPolicy['type'][];
}

// Presentation Layer Response DTOs
export interface GetTemporaryUserRes extends GetTemporaryUserRet {}

export interface IsDuplicatedNicknameRes extends IsDuplicateNicknameRet {}

export interface SendPhoneNumberAuthCodeRes extends SendPhoneNumberAuthCodeRet {}

export interface ConfirmAuthCodeRes extends ConfirmAuthCodeRet {}

export interface RegisterUserRes extends RegisterUserRet {}
