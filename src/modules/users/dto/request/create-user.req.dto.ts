import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';

export type CreateUserReqDto = Pick<UserEntity, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<UserEntity, 'phoneNumber' | 'gender' | 'birth'>>;
