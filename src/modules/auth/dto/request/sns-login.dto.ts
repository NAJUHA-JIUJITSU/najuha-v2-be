import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';

export type SnsLoginReqDto = {
  /**
   * snsProvider.
   */
  snsAuthProvider: UserEntity['snsAuthProvider'];

  /**
   * authCode.
   */
  snsAuthCode: string;
};
