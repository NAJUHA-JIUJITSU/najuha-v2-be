import { Policy } from 'src/modules/policy/domain/entities/policy.entity';
import { IUser } from 'src/modules/users/structure/interface/user.interface';

export type RegisterReqDto = {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: Policy['type'][];
};
