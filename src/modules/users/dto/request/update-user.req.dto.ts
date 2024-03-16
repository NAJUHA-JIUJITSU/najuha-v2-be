import { UserEntity } from 'src/modules/users/domain/user.entity';

export type UpdateUserReqDto = Partial<Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
