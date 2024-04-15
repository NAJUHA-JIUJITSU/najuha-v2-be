import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyTable } from '../../infrastructure/database/tables/policy/policy.entity';
import { IPolicy } from './domain/interface/policy.interface';

@Injectable()
export class PolicyRepository {
  constructor(
    @InjectRepository(PolicyTable)
    private readonly policyRepository: Repository<PolicyTable>,
  ) {}

  async createPolicy(dto: Partial<IPolicy>): Promise<IPolicy> {
    const policy = this.policyRepository.create(dto);
    return await this.policyRepository.save(policy);
  }

  async findPolicy({ where, relations, order }: FindOneOptions<IPolicy>): Promise<IPolicy | null> {
    const policy = await this.policyRepository.findOne({ where, relations, order });
    return policy;
  }

  async findPolicies({ where, relations, order }: FindOneOptions<IPolicy>): Promise<IPolicy[]> {
    const policies = await this.policyRepository.find({
      where,
      relations,
      order,
    });
    return policies;
  }

  async findAllTypesOfLatestPolicies(): Promise<IPolicy[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }
}
