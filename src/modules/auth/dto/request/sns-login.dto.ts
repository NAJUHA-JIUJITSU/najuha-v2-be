import { IUser } from 'src/interfaces/user.interface';

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
