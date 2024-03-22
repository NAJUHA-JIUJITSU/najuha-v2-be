import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';

export type TemporaryUserResDto = {
  id: UserEntity['id'];
  role: UserEntity['role'];
  snsAuthProvider: UserEntity['snsAuthProvider'];
  snsId: UserEntity['snsId'];
  email: UserEntity['email'];
  name: UserEntity['name'];
  phoneNumber: UserEntity['phoneNumber'] | null;
  nickname: UserEntity['nickname'] | null;
  gender: UserEntity['gender'] | null;
  birth: UserEntity['birth'] | null;
  belt: UserEntity['belt'] | null;
  profileImageUrlKey: UserEntity['profileImageUrlKey'] | null;
  status: UserEntity['status'];
  createdAt: UserEntity['createdAt'];
  updatedAt: UserEntity['updatedAt'];
};
