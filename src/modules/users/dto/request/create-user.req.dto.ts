import { IUser } from '../../domain/structure/user.interface';

export type CreateUserReqDto = Pick<IUser, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<IUser, 'phoneNumber' | 'gender' | 'birth'>>;