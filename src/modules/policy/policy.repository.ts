import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from './domain/entities/policy.entity';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
  ) {}

  async createPolicy(dto: Partial<Policy>): Promise<Policy> {
    const policy = this.policyRepository.create(dto);
    return await this.policyRepository.save(policy);
  }

  async findPolicy({ where, relations, order }: FindOneOptions<Policy>): Promise<Policy | null> {
    const policy = await this.policyRepository.findOne({ where, relations, order });
    return policy;
  }

  async findPolicies({ where, relations, order }: FindOneOptions<Policy>): Promise<Policy[]> {
    const policies = await this.policyRepository.find({
      where,
      relations,
      order,
    });
    return policies;
  }

  async findAllTypesOfLatestPolicies(): Promise<Policy[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }
}
