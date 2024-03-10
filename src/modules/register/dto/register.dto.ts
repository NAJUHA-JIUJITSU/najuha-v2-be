import { PolicyEntity } from 'src/infra/database/entities/policy.entity';
import { UserEntity } from 'src/infra/database/entities/user.entity';

export type RegisterDto = {
  user: Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: PolicyEntity['type'][];
};
