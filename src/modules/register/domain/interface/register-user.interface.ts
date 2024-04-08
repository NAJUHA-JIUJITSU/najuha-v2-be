import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPolicyConsent } from 'src/modules/register/domain/interface/policy-consent.interface';

// TODO: 더 작관적인 이름으로 변경
export interface IRegisterUser extends IUser {
  policyConsents: IPolicyConsent[];
}
