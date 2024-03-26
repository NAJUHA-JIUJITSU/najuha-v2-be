import { User } from 'src/modules/users/domain/entities/user.entity';

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
