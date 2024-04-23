import { Injectable } from '@nestjs/common';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { ulid } from 'ulid';

@Injectable()
export class RegisterUserEntityFactory {
  async createRegisterUser(
    user: IUser.Entity.RegisterUser,
    latestPolicies: IPolicy[],
    consentPolicyTypes: string[],
  ): Promise<IUser.Entity.RegisterUser> {
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
