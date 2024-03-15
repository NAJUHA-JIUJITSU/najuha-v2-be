import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

export interface UserResDto extends Omit<UserEntity, 'policyConsents'> {}
