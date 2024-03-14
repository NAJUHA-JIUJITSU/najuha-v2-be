import { IUser } from 'src/interfaces/user.interface';

export type UpdateUserReqDto = Partial<Pick<IUser, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
