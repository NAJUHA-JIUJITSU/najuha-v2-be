import { Injectable } from '@nestjs/common';
import { IRegisterUser } from './interface/register-user.interface';
import { RegisterRepository } from '../register.repository';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

@Injectable()
export class RegisterUserFactory {
  constructor(private readonly registerRepository: RegisterRepository) {}

  async create(userId: IUser['id'], consentPolicyTypes: string[]): Promise<IRegisterUser> {
    const user = await this.registerRepository.getUser({ where: { id: userId }, relations: ['policyConsents'] });
    const latestPolicies = await this.registerRepository.findAllTypesOfLatestPolicies();

    const unconsentedPolicies = latestPolicies.filter(
      (policy) =>
        !user.policyConsents.some((consent) => consent.policyId === policy.id) &&
        consentPolicyTypes.includes(policy.type),
    );

    const newPolicyConsents = unconsentedPolicies.map((policy) => {
      const policyConsent = {
        id: 0, // TODO: id 어떻게 처리할지 고민
        userId: user.id,
        policyId: policy.id,
        createdAt: new Date(),
      };
      return policyConsent;
    });

    return { ...user, policyConsents: [...user.policyConsents, ...newPolicyConsents] };
  }
}
