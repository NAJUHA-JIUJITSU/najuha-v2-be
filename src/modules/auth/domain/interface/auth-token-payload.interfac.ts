import { IUser } from 'src/modules/users/domain/interface/user.interface';

export interface IAuthTokenPayload {
  userId: IUser['id'];
  userRole: IUser['role'];
}
