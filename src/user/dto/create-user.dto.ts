import { UserEntity } from '../user.entity';

export type CreateUserDto = Partial<
  Pick<
    UserEntity,
    'snsId' | 'snsProvider' | 'email' | 'name' | 'nickname' | 'phoneNumber'
    // 다른 필요한 속성들 추가
  >
>;
