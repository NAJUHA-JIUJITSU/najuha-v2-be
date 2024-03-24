import { User } from 'src/infrastructure/database/entities/user/user.entity';

export type UpdateUserReqDto = Partial<Pick<User, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
