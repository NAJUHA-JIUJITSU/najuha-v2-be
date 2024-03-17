import { User } from 'src/modules/users/domain/user.entity';

export type SnsLoginReqDto = {
  /**
   * snsProvider.
   */
  snsAuthProvider: User['snsAuthProvider'];

  /**
   * authCode.
   */
  snsAuthCode: string;
};
