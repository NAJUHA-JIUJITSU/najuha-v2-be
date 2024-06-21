import { NotNull, Nullable } from '../../../../common/utility-types';
import { IPolicyConsent } from '../../../register/domain/interface/policy-consent.interface';
import { IUser } from './user.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
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
export interface ITemporaryUserCreateDto {
  snsAuthProvider: ITemporaryUser['snsAuthProvider'];
  snsId: ITemporaryUser['snsId'];
  email: ITemporaryUser['email'];
  name: ITemporaryUser['name'];
  phoneNumber?: ITemporaryUser['phoneNumber'];
  gender?: ITemporaryUser['gender'];
  birth?: ITemporaryUser['birth'];
}

export interface IUserRgistertDto extends Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'> {}
