import { IUser } from './user.interface';
import { IPolicyConsent } from './policy-consent.interface';

interface ITemporaryUserBase
  extends Omit<IUser, 'phoneNumber' | 'nickname' | 'gender' | 'birth' | 'belt' | 'profileImageUrlKey'> {
  policyConsents?: IPolicyConsent[];
}

interface ITemporaryUserNullableFields {
  phoneNumber?: IUser['phoneNumber'] | null;
  nickname?: IUser['nickname'] | null;
  gender?: IUser['gender'] | null;
  birth?: IUser['birth'] | null;
  belt?: IUser['belt'] | null;
  profileImageUrlKey?: IUser['profileImageUrlKey'] | null;
}

export interface ITemporaryUser extends ITemporaryUserBase, ITemporaryUserNullableFields {}
