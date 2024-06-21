import { IUser } from '../../users/domain/interface/user.interface';

/**
 * 각 snsAuthProvider 마다 제공되는 정보.
 * - kakao  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - naver  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - google : snsId, email, name.
 * - apple  : snsId, email, name.
 */
export interface ISnsAuthValidatedUserData
  extends Pick<IUser, 'snsAuthProvider' | 'snsId' | 'name' | 'email'>,
    Partial<Pick<IUser, 'gender' | 'birth' | 'phoneNumber'>> {}
