import { Injectable } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { BusinessException, PolicyErrorMap } from 'src/common/response/errorResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from '../../entities/policy/policy.entity';

// @Injectable()
// export class PolicyRepository extends Repository<Policy> {
//   constructor(private dataSource: DataSource) {
//     super(Policy, dataSource.createManager());
//   }

//   async saveOrFail(dto: Pick<Policy, 'id'> & Partial<Policy>): Promise<Policy> {
//     const policy = await this.findOne({ where: { id: dto.id } });
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return await this.save({ ...policy, ...dto });
//   }

//   async updateOrFail(dto: Pick<Policy, 'id'> & Partial<Policy>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//   }

//   async getOneOrFail(where: FindOptionsWhere<Policy>): Promise<Policy> {
//     const policy = await this.findOne({ where });
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return policy;
//   }

//   async getOneLatestPolicyByTypeOrFail(type: Policy['type']): Promise<Policy> {
//     const policy = await this.createQueryBuilder('policy')
//       .where('policy.type = :type', { type })
//       .orderBy('policy.createdAt', 'DESC')
//       .getOne();
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return policy;
//   }

//   async findAllTypesOfLatestPolicies(): Promise<Policy[]> {
//     return this.createQueryBuilder('policy')
//       .distinctOn(['policy.type'])
//       .orderBy('policy.type')
//       .addOrderBy('policy.createdAt', 'DESC')
//       .getMany();
//   }
// }

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

  async getPolicy(where: FindOptionsWhere<Policy>): Promise<Policy> {
    const policy = await this.policyRepository.findOne({ where });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async getLatestPolicyByType(type: Policy['type']): Promise<Policy> {
    const policy = await this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.type = :type', { type })
      .orderBy('policy.createdAt', 'DESC')
      .getOne();
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async findAllTypesOfLatestPolicies(): Promise<Policy[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }

  async savePolicy(dto: Pick<Policy, 'id'> & Partial<Policy>): Promise<Policy> {
    const policy = await this.policyRepository.findOne({ where: { id: dto.id } });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return await this.policyRepository.save({ ...policy, ...dto });
  }

  async updatePolicy(dto: Pick<Policy, 'id'> & Partial<Policy>): Promise<void> {
    const result = await this.policyRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
  }
}
