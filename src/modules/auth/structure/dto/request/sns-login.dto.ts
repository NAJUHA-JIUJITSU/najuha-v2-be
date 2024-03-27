import { IUser } from 'src/modules/users/structure/interface/user.interface';

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
