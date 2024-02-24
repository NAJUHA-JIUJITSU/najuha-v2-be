import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(PolicyEntity)
    private policyRepository: Repository<PolicyEntity>,
  ) {}

  async createPolicy(createPolicyDto: CreatePolicyDto): Promise<PolicyEntity> {
    const newPolicy = this.policyRepository.create(createPolicyDto);
    return await this.policyRepository.save(newPolicy);
  }

  async getAllPolicies(): Promise<PolicyEntity[]> {
    return this.policyRepository.find();
  }

  async getAllTypesOfPolicies(): Promise<PolicyEntity[]> {
    return this.policyRepository.find();
  }

  async getPolicy(id: number): Promise<PolicyEntity | null> {
    return this.policyRepository.findOne({ where: { id } });
  }

  async updatePolicy(id: number, updatePolicyDto: any): Promise<PolicyEntity> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    if (!policy) {
      throw new Error('Policy not found'); //TODO : 에러표준화
    }
    return this.policyRepository.save({ ...policy, ...updatePolicyDto });
  }

  async deletePolicy(id: number): Promise<void> {
    await this.policyRepository.delete(id);
  }
}
