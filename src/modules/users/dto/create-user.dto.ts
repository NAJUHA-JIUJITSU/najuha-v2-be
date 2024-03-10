import { UserEntity } from 'src/infra/database/entities/user.entity';

export type CreateUserDto = Pick<UserEntity, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<UserEntity, 'phoneNumber' | 'gender' | 'birth'>>;
