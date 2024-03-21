import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PolicyEntity } from '../../entities/policy/policy.entity';
import { BusinessException, PolicyErrorMap } from 'src/common/response/errorResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { IPolicy } from 'src/modules/policy/structure/policy.interface';

// @Injectable()
// export class PolicyRepository extends Repository<IPolicy> {
//   constructor(private dataSource: DataSource) {
//     super(IPolicy, dataSource.createEntityManager());
//   }

//   async saveOrFail(dto: Pick<IPolicy, 'id'> & Partial<IPolicy>): Promise<IPolicy> {
//     const policy = await this.findOne({ where: { id: dto.id } });
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return await this.save({ ...policy, ...dto });
//   }

//   async updateOrFail(dto: Pick<IPolicy, 'id'> & Partial<IPolicy>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//   }

//   async getOneOrFail(where: FindOptionsWhere<IPolicy>): Promise<IPolicy> {
//     const policy = await this.findOne({ where });
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return policy;
//   }

//   async getOneLatestPolicyByTypeOrFail(type: IPolicy['type']): Promise<IPolicy> {
//     const policy = await this.createQueryBuilder('policy')
//       .where('policy.type = :type', { type })
//       .orderBy('policy.createdAt', 'DESC')
//       .getOne();
//     if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
//     return policy;
//   }

//   async findAllTypesOfLatestPolicies(): Promise<IPolicy[]> {
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

  async createPolicy(dto: Partial<IPolicy>): Promise<IPolicy> {
    const policy = this.policyRepository.create(dto);
    return this.policyRepository.create(policy);
  }

  async findPolicy(options?: {
    where?: Partial<IPolicy>;
    relations?: string[];
    order?: { [P in keyof IPolicy]?: 'ASC' | 'DESC' };
  }): Promise<IPolicy | null> {
    const policy = await this.policyRepository.findOne({
      where: options?.where,
      relations: options?.relations,
      order: options?.order,
    });
    return policy;
  }

  async findPolicies(options?: {
    where?: Partial<IPolicy>;
    relations?: string[];
    order?: { [P in keyof IPolicy]?: 'ASC' | 'DESC' };
  }): Promise<IPolicy[]> {
    const policies = await this.policyRepository.find({
      where: options?.where,
      relations: options?.relations,
      order: options?.order,
    });
    return policies;
  }

  async getPolicy(where: FindOptionsWhere<IPolicy>): Promise<IPolicy> {
    const policy = await this.policyRepository.findOne({ where });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async getLatestPolicyByType(type: IPolicy['type']): Promise<IPolicy> {
    const policy = await this.policyRepository
      .createQueryBuilder('policy')
      .where('policy.type = :type', { type })
      .orderBy('policy.createdAt', 'DESC')
      .getOne();
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async findAllTypesOfLatestPolicies(): Promise<IPolicy[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }

  async savePolicy(dto: Pick<IPolicy, 'id'> & Partial<IPolicy>): Promise<IPolicy> {
    const policy = await this.policyRepository.findOne({ where: { id: dto.id } });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return await this.policyRepository.save({ ...policy, ...dto });
  }

  async updatePolicy(dto: Pick<IPolicy, 'id'> & Partial<IPolicy>): Promise<void> {
    const result = await this.policyRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
  }
}
