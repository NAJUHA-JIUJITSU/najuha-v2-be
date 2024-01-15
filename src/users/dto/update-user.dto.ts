import { UserEntity } from '../entities/user.entity';

export interface UpdateUserDto
  extends Partial<
    Pick<
      UserEntity,
      | 'name'
      | 'email'
      | 'nickname'
      | 'phoneNumber'
      | 'gender'
      | 'belt'
      | 'weight'
    >
  > {}
