import { UserEntity } from 'src/users/entities/user.entity';

export type UpdateUserDto = Partial<Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
