import { Policy } from 'src/modules/policy/domain/entities/policy.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';

export type RegisterReqDto = {
  user: Pick<User, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: Policy['type'][];
};
