import { UserEntity } from '../user.entity';

export type CreateUserDto = Pick<UserEntity, 'name' | 'email'>;
