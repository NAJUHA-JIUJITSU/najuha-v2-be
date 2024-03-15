import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

export type RegisterReqDto = {
  user: Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: PolicyEntity['type'][];
};