import { Policy } from 'src/modules/policy/domain/policy.entity';
import { User } from 'src/modules/users/domain/user.entity';

export type RegisterReqDto = {
  user: Pick<User, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: Policy['type'][];
};
