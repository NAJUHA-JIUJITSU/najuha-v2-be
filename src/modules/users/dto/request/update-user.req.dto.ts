import { User } from 'src/modules/users/domain/user.entity';

export type UpdateUserReqDto = Partial<Pick<User, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
