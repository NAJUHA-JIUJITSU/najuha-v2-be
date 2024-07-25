import { NotNull, Nullable } from '../../../../common/utility-types';
import { IPolicyConsent } from './policy-consent.interface';
import { IUser } from './user.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * TemporaryUser.
 *
 * 회원가입이 완료되지 않은 사용자.
 * - 회원가입이 완료되면 User로 이동한다.
 * @namespace TemporaryUser
 */
export interface ITemporaryUser
  extends Pick<
      IUser,
      'id' | 'role' | 'snsAuthProvider' | 'snsId' | 'email' | 'name' | 'status' | 'createdAt' | 'updatedAt'
    >,
    Nullable<Pick<IUser, 'phoneNumber' | 'nickname' | 'gender' | 'birth' | 'belt'>> {}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ITemporaryUserModelData {
  id: ITemporaryUser['id'];
  role: ITemporaryUser['role'];
  snsAuthProvider: ITemporaryUser['snsAuthProvider'];
  snsId: ITemporaryUser['snsId'];
  email: ITemporaryUser['email'];
  name: ITemporaryUser['name'];
  status: ITemporaryUser['status'];
  createdAt: ITemporaryUser['createdAt'];
  updatedAt: ITemporaryUser['updatedAt'];
  phoneNumber: ITemporaryUser['phoneNumber'];
  nickname: ITemporaryUser['nickname'];
  gender: ITemporaryUser['gender'];
  birth: ITemporaryUser['birth'];
  belt: ITemporaryUser['belt'] | null;
  policyConsents?: IPolicyConsent[];
}

export interface IRegisteredUserModelData extends Required<NotNull<ITemporaryUserModelData>> {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ITemporaryUserCreateDto
  extends Pick<IUser, 'snsAuthProvider' | 'snsId' | 'email' | 'name'>,
    Partial<Pick<IUser, 'phoneNumber' | 'gender' | 'birth'>> {}

export interface IUserRgistertDto extends Pick<IUser, 'id' | 'nickname' | 'gender' | 'belt' | 'birth'> {}
