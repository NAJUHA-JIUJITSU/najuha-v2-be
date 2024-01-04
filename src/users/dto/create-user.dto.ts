import { UserEntity } from '../entities/user.entity';

export type CreateUserDto = Pick<
  UserEntity,
  'snsId' | 'snsProvider' | 'name' | 'email' | 'phoneNumber' | 'gender'
>;
