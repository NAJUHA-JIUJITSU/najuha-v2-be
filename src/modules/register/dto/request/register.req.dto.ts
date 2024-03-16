import { PolicyEntity } from 'src/modules/policy/domain/policy.entity';
import { UserEntity } from 'src/modules/users/domain/user.entity';

export type RegisterReqDto = {
  user: Pick<UserEntity, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: PolicyEntity['type'][];
};
