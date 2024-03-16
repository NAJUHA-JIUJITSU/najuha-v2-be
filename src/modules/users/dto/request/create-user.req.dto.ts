import { UserEntity } from 'src/modules/users/domain/user.entity';

export type CreateUserReqDto = Pick<UserEntity, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<UserEntity, 'phoneNumber' | 'gender' | 'birth'>>;
