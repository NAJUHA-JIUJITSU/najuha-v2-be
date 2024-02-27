import { UserEntity } from 'src/users/entities/user.entity';

// export type CreateUserDto = Pick<
//   UserEntity,
//   'snsId' | 'snsAuthProvider' | 'name' | 'email' | 'phoneNumber' | 'gender' | 'birth'
// >;

export type CreateUserDto = {
  snsId: UserEntity['snsId'];
  snsAuthProvider: UserEntity['snsAuthProvider'];
  name: UserEntity['name'];
  email: UserEntity['email'];
  phoneNumber?: UserEntity['phoneNumber'];
  gender?: UserEntity['gender'];
  birth?: UserEntity['birth'];
};
