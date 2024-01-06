import { UserEntity } from '../user.entity';

// export type UpdateUserDto = Pick<UserEntity, 'name' | 'email'>;
export type UpdateUserDto = Partial<
  Pick<UserEntity, 'nickname' | 'phoneNumber'>
>;
