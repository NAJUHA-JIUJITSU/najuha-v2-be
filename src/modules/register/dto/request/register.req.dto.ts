import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';
import { IUser } from 'src/modules/users/domain/structure/user.interface';

export type RegisterReqDto = {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: Policy['type'][];
};
