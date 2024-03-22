import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';

export interface UserResDto extends Omit<UserEntity, 'policyConsents'> {}
