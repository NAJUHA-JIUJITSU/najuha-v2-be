import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyConsentEntity } from 'src/policy/entities/policy-consent.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { PolicyEntity } from './entities/policy.entity';

@Injectable()
export class PolicyConsentService {
  constructor(
    @InjectRepository(PolicyConsentEntity)
    private policyConsentRepository: Repository<PolicyConsentEntity>,
  ) {}

  async createPolicyConsent(userId: UserEntity['id'], policyId: PolicyEntity['id']): Promise<PolicyConsentEntity> {
    const policyConsent = this.policyConsentRepository.create({
      userId,
      policyId,
    });
    return await this.policyConsentRepository.save(policyConsent);
  }

  // async findAllPolicyConsents(): Promise<PolicyConsentEntity[]> {
  //   return this.policyConsentRepository.find({ relations: ['user', 'policy'] });
  // }

  // async findOnePolicyConsent(id: number): Promise<PolicyConsentEntity | null> {
  //   return this.policyConsentRepository.findOne({ where: { id }, relations: ['user', 'policy'] });
  // }
}
