import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';
import { User } from 'src/infrastructure/database/entities/user/user.entity';

export type RegisterReqDto = {
  user: Pick<User, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: Policy['type'][];
};
