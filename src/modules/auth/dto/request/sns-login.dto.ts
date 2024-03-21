import { IUser } from 'src/modules/users/structure/user.interface';

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
