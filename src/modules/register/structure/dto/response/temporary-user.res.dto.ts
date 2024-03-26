import { User } from 'src/modules/users/domain/entities/user.entity';

export interface TemporaryUserResDto {
  user: {
    id: User['id'];
    role: User['role'];
    snsAuthProvider: User['snsAuthProvider'];
    snsId: User['snsId'];
    email: User['email'];
    name: User['name'];
    phoneNumber: User['phoneNumber'] | null;
    nickname: User['nickname'] | null;
    gender: User['gender'] | null;
    birth: User['birth'] | null;
    belt: User['belt'] | null;
    profileImageUrlKey: User['profileImageUrlKey'] | null;
    status: User['status'];
    createdAt: User['createdAt'];
    updatedAt: User['updatedAt'];
  };
}
