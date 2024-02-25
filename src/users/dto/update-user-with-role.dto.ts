import { UserEntity } from 'src/users/entities/user.entity';

export type UpdateUserWithRoleDto = Partial<
  Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth' | 'role'>
>;
