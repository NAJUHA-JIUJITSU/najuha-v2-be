import { UserEntity } from 'src/users/entities/user.entity';

export interface UpdateUserDto extends Partial<Pick<UserEntity, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>> {}
