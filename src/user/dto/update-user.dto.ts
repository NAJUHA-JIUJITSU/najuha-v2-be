import { UserEntity } from '../user.entity';

// export type UpdateUserDto = Pick<UserEntity, 'name' | 'email'>;
export type UpdateUserDto = Partial<Pick<UserEntity, 'name' | 'email'>>;

// export type UpdateUserDto = {
//   name: UserEntity['name'];
//   email?: UserEntity['email'];
// };

// export type UpdateUserDto = Pick<UserEntity, 'name'> & Partial<Pick<UserEntity, 'email'>>;

// interface UpdateUserDto extends Partial<UserEntity> {
//   name: UserEntity['name'];
// }
