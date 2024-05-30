import { IUser } from 'src/modules/users/domain/interface/user.interface';

export interface ISnsAuthValidatedUserData
  extends Pick<IUser, 'snsAuthProvider' | 'snsId' | 'name' | 'email'>,
    Partial<Pick<IUser, 'gender' | 'birth' | 'phoneNumber'>> {}
