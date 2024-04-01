import { IUser } from '../../domain/structure/user.interface';

export type UpdateUserReqDto = Partial<Pick<IUser, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
