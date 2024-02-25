import { UserEntity } from 'src/users/entities/user.entity';

export type SnsAuthDto = {
  /**
   * snsProvider.
   */
  snsAuthProvider: UserEntity['snsAuthProvider'];

  /**
   * authCode.
   */
  snsAuthCode: string;
};
