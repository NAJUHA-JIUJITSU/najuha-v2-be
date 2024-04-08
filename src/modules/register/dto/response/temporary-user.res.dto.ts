import { IUser } from 'src/modules/users/domain/interface/user.interface';

export interface TemporaryUserResDto {
  user: {
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
    profileImageUrlKey: IUser['profileImageUrlKey'] | null;
    status: IUser['status'];
    createdAt: IUser['createdAt'];
    updatedAt: IUser['updatedAt'];
  };
}
