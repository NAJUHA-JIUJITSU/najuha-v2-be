import { User } from 'src/infrastructure/database/entities/user/user.entity';

export type CreateUserReqDto = Pick<User, 'snsId' | 'snsAuthProvider' | 'name' | 'email'> &
  Partial<Pick<User, 'phoneNumber' | 'gender' | 'birth'>>;
