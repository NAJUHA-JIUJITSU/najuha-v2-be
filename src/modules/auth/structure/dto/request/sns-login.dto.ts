import { IUser } from 'src/modules/users/domain/user.interface';

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
