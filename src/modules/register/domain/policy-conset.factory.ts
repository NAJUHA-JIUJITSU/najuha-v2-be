import { Injectable } from '@nestjs/common';
import { IRegisterUser } from '../../users/domain/interface/user.interface';
import { IPolicy, IPolicyFindMany } from '../../policy/domain/interface/policy.interface';
import { uuidv7 } from 'uuidv7';
import { IPolicyConsent } from './interface/policy-consent.interface';

@Injectable()
export class PolicyConsentFactory {
  createPolicyConsents(
    userId: IRegisterUser['id'],
    latestPolicies: IPolicyFindMany[],
    consentPolicyTypes: IPolicy['type'][],
  ): IPolicyConsent[] {
    const consetPolicies = latestPolicies.filter((policy) => consentPolicyTypes.includes(policy.type));
    return consetPolicies.map((policy) => ({
      id: uuidv7(),
      userId,
      policyId: policy.id,
      createdAt: new Date(),
    }));
  }
}
