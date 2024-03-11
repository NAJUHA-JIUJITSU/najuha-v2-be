import { IPolicy } from 'src/interfaces/policy.interface';
import { IUser } from 'src/interfaces/user.interface';

export type RegisterDto = {
  user: Pick<IUser, 'nickname' | 'gender' | 'belt' | 'birth'>;
  consentPolicyTypes: IPolicy['type'][];
};
