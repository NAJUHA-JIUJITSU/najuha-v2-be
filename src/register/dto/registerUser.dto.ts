import { UserEntity } from 'src/users/entities/user.entity';

export interface RegisterUserDto extends Partial<Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'>> {}
