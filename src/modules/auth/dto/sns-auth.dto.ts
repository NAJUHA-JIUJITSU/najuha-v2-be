import { UserEntity } from 'src/infra/database/entities/user.entity';

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
