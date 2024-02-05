import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyConsentEntity } from 'src/policy/entities/policy-consent.entity';
import { CreatePolicyConsentDto } from './dto/create-policy-consent.dto';

@Injectable()
export class PolicyConsentService {
  constructor(
    @InjectRepository(PolicyConsentEntity)
    private policyConsentRepository: Repository<PolicyConsentEntity>,
  ) {}

  async createPolicyConsent(createPolicyConsentDto: CreatePolicyConsentDto): Promise<PolicyConsentEntity> {
    const newPolicyConsent = this.policyConsentRepository.create(createPolicyConsentDto);
    return this.policyConsentRepository.save(newPolicyConsent);
  }

  async findAllPolicyConsents(): Promise<PolicyConsentEntity[]> {
    return this.policyConsentRepository.find({ relations: ['user', 'policy'] });
  }

  async findOnePolicyConsent(id: number): Promise<PolicyConsentEntity | null> {
    return this.policyConsentRepository.findOne({ where: { id }, relations: ['user', 'policy'] });
  }
}
