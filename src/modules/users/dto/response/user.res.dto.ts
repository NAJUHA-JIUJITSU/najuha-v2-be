import { User } from 'src/modules/users/domain/user.entity';

export interface UserResDto extends Omit<User, 'policyConsents'> {}
