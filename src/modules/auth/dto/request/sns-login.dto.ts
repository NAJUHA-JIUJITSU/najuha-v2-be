import { User } from 'src/infrastructure/database/entities/user/user.entity';

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
