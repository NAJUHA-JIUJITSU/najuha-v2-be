import { UserEntity } from 'src/modules/users/domain/user.entity';

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
