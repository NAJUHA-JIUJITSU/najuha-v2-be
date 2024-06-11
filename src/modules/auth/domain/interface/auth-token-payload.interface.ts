import { IUser } from '../../../users/domain/interface/user.interface';

export interface IAuthTokenPayload {
  userId: IUser['id'];
  userRole: IUser['role'];
}
