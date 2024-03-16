import { UserEntity } from 'src/modules/users/domain/user.entity';

export interface UserResDto extends Omit<UserEntity, 'policyConsents'> {}
