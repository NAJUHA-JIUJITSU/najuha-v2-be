import { IPolicy } from 'src/modules/policy/structure/policy.interface';
import { IUser } from 'src/modules/users/structure/user.interface';

export type RegisterReqDto = {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: IPolicy['type'][];
};
