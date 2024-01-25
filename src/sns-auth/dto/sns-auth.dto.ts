import { UserEntity } from 'src/users/entities/user.entity';

export interface SnsAuthDto {
  /**
   * snsProvider.
   */
  snsAuthProvider: UserEntity['snsAuthProvider'];

  /**
   * authCode.
   */
  snsAuthCode: string;
}
