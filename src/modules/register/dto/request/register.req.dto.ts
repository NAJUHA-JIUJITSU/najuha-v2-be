import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

export type RegisterReqDto = {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: IPolicy['type'][];
};
