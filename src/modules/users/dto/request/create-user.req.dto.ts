import { User } from 'src/modules/users/domain/user.entity';

export type CreateUserReqDto = Pick<User, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<User, 'phoneNumber' | 'gender' | 'birth'>>;
