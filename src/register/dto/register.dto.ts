import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export type RegisterDto = {
  user: Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: PolicyEntity['type'][];
};
