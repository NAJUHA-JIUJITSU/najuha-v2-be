import { UserEntity } from 'src/users/entities/user.entity';

export interface UpdateUserWithRoleDto
  extends Partial<Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth' | 'role'>> {}
