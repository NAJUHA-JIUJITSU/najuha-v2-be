import { PhoneNumberAuthCode } from '../../domain/interface/phone-number-auth-code.type';

export type confirmAuthCodeReqDto = {
  authCode: PhoneNumberAuthCode;
};
