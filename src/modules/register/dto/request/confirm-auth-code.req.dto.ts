import { PhoneNumberAuthCode } from '../../domain/structure/phone-number-auth-code.type';

export type confirmAuthCodeReqDto = {
  authCode: PhoneNumberAuthCode;
};
