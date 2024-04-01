import { IUser } from 'src/modules/users/domain/structure/user.interface';
import { IPolicyConsent } from 'src/modules/register/domain/structure/policy-consent.interface';

// TODO: 더 작관적인 이름으로 변경
export interface IRegisterUser extends IUser {
  policyConsents: IPolicyConsent[];
}
