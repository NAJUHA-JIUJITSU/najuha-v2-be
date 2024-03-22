import { Injectable } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { BusinessException, PolicyErrorMap } from 'src/common/response/errorResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyEntity } from '../../entities/policy/policy.entity';

// @Injectable()
// export class PolicyRepository extends Repository<PolicyEntity> {
//   constructor(private dataSource: DataSource) {
//     super(PolicyEntity, dataSource.createEntityManager());
//   }

//   async saveOrFail(dto: Pick<PolicyEntity, 'id'> & Partial<PolicyEntity>): Promise<PolicyEntity> {
//     const policy = await this.findOne({ where: { id: dto.id } });
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return await this.save({ ...policy, ...dto });
//   }

//   async updateOrFail(dto: Pick<PolicyEntity, 'id'> & Partial<PolicyEntity>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//   }

//   async getOneOrFail(where: FindOptionsWhere<PolicyEntity>): Promise<PolicyEntity> {
//     const policy = await this.findOne({ where });
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return policy;
//   }

//   async getOneLatestPolicyByTypeOrFail(type: PolicyEntity['type']): Promise<PolicyEntity> {
//     const policy = await this.createQueryBuilder('policy')
//       .where('policy.type = :type', { type })
//       .orderBy('policy.createdAt', 'DESC')
//       .getOne();
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return policy;
//   }

//   async findAllTypesOfLatestPolicies(): Promise<PolicyEntity[]> {
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
    @InjectRepository(PolicyEntity)
    private readonly policyRepository: Repository<PolicyEntity>,
  ) {}

  async createPolicy(dto: Partial<PolicyEntity>): Promise<PolicyEntity> {
    const policy = this.policyRepository.create(dto);
    return await this.policyRepository.save(policy);
  }

  async findPolicy({ where, relations, order }: FindOneOptions<PolicyEntity>): Promise<PolicyEntity | null> {
    const policy = await this.policyRepository.findOne({ where, relations, order });
    return policy;
  }

  async findPolicies({ where, relations, order }: FindOneOptions<PolicyEntity>): Promise<PolicyEntity[]> {
    const policies = await this.policyRepository.find({
      where,
      relations,
      order,
    });
    return policies;
  }

  async getPolicy(where: FindOptionsWhere<PolicyEntity>): Promise<PolicyEntity> {
    const policy = await this.policyRepository.findOne({ where });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async getLatestPolicyByType(type: PolicyEntity['type']): Promise<PolicyEntity> {
    const policy = await this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.type = :type', { type })
      .orderBy('policy.createdAt', 'DESC')
      .getOne();
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async findAllTypesOfLatestPolicies(): Promise<PolicyEntity[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }

  async savePolicy(dto: Pick<PolicyEntity, 'id'> & Partial<PolicyEntity>): Promise<PolicyEntity> {
    const policy = await this.policyRepository.findOne({ where: { id: dto.id } });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return await this.policyRepository.save({ ...policy, ...dto });
  }

  async updatePolicy(dto: Pick<PolicyEntity, 'id'> & Partial<PolicyEntity>): Promise<void> {
    const result = await this.policyRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
  }
}
