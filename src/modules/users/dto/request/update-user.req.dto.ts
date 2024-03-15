import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

export type UpdateUserReqDto = Partial<Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
