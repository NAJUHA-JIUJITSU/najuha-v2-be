import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

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
