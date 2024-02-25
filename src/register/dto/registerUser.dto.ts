import { UserEntity } from 'src/users/entities/user.entity';

export type RegisterUserDto = Partial<Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'>>;
