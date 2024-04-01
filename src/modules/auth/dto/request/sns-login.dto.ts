import { IUser } from 'src/modules/users/domain/structure/user.interface';

export type SnsLoginReqDto = {
  /**
   * snsProvider.
   */
  snsAuthProvider: IUser['snsAuthProvider'];

  /**
   * authCode.
   */
  snsAuthCode: string;
};
