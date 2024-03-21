import { IUser } from '../../user.interface';

export type UpdateUserReqDto = Partial<Pick<IUser, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
