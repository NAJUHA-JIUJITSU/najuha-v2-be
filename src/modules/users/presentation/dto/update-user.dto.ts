import { IUser } from 'src/interfaces/user.interface';

export type UpdateUserDto = Partial<Pick<IUser, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>>;
