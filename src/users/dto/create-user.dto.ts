import { UserEntity } from '../entities/user.entity';

export type CreateUserDto = Pick<
  UserEntity,
  'snsId' | 'snsAuthProvider' | 'name' | 'email' | 'phoneNumber' | 'gender'
>;
