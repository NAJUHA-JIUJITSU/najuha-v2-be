import { IUser } from 'src/interfaces/user.interface';

export type CreateUserDto = Pick<IUser, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<IUser, 'phoneNumber' | 'gender' | 'birth'>>;
