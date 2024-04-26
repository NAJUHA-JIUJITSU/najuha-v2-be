import { Injectable } from '@nestjs/common';
import { IRegisterUser, IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { ulid } from 'ulid';

@Injectable()
export class RegisterUserEntityFactory {
  async createRegisterUser(
    user: IRegisterUser,
    latestPolicies: IPolicy[],
    consentPolicyTypes: string[],
  ): Promise<IRegisterUser> {
    const unconsentedPolicies = latestPolicies.filter(
      (policy) =>
        !user.policyConsents.some((consent) => consent.policyId === policy.id) &&
        consentPolicyTypes.includes(policy.type),
    );

    const newPolicyConsents = unconsentedPolicies.map((policy) => {
      const policyConsent = {
        id: ulid(),
        userId: user.id,
        policyId: policy.id,
        createdAt: new Date(),
      };
      return policyConsent;
    });

    return { ...user, policyConsents: [...user.policyConsents, ...newPolicyConsents] };
  }
}
