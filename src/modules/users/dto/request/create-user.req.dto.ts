import { IUser } from '../../domain/interface/user.interface';

export type CreateUserReqDto = Pick<IUser, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<IUser, 'phoneNumber' | 'gender' | 'birth'>>;
