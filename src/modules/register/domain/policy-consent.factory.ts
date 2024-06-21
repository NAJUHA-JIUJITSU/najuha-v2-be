import { Injectable } from '@nestjs/common';
import { IUser } from '../../users/domain/interface/user.interface';
import { IPolicy, IPolicySummery } from '../../policy/domain/interface/policy.interface';
import { uuidv7 } from 'uuidv7';
import { IPolicyConsent } from './interface/policy-consent.interface';

@Injectable()
export class PolicyConsentFactory {
  createPolicyConsents(
    userId: IUser['id'],
    latestPolicies: IPolicySummery[],
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
