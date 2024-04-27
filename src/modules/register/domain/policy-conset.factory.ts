import { Injectable } from '@nestjs/common';
import { IRegisterUser } from 'src/modules/users/domain/interface/user.interface';
import { IPolicy, IPolicyFindMany } from 'src/modules/policy/domain/interface/policy.interface';
import { ulid } from 'ulid';
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
      id: ulid(),
      userId,
      policyId: policy.id,
      createdAt: new Date(),
    }));
  }
}
