import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

export type UpdateUserDto = Partial<Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
