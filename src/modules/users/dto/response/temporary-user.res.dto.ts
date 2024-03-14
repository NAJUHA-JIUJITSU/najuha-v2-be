import { IUser } from 'src/interfaces/user.interface';

export type TemporaryUserResDto = {
  id: IUser['id'];
  role: IUser['role'];
  snsAuthProvider: IUser['snsAuthProvider'];
  snsId: IUser['snsId'];
  email: IUser['email'];
  name: IUser['name'];
  phoneNumber: IUser['phoneNumber'] | null;
  nickname: IUser['nickname'] | null;
  gender: IUser['gender'] | null;
  birth: IUser['birth'] | null;
  belt: IUser['belt'] | null;
  profileImageUrlKey: IUser['profileImageUrlKey'];
  status: IUser['status'];
  createdAt: IUser['createdAt'];
  updatedAt: IUser['updatedAt'];
};
