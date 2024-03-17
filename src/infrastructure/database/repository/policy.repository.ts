import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { Policy } from '../../../modules/policy/domain/policy.entity';
import { BusinessException, PolicyErrorMap } from 'src/common/response/errorResponse';

@Injectable()
export class PolicyRepository extends Repository<Policy> {
  constructor(private dataSource: DataSource) {
    super(Policy, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<Policy, 'id'> & Partial<Policy>): Promise<Policy> {
    const policy = await this.findOne({ where: { id: dto.id } });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return await this.save({ ...policy, ...dto });
  }

  async updateOrFail(dto: Pick<Policy, 'id'> & Partial<Policy>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
  }

  async getOneOrFail(where: FindOptionsWhere<Policy>): Promise<Policy> {
    const policy = await this.findOne({ where });
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async getOneLatestPolicyByTypeOrFail(type: Policy['type']): Promise<Policy> {
    const policy = await this.createQueryBuilder('policy')
      .where('policy.type = :type', { type })
      .orderBy('policy.createdAt', 'DESC')
      .getOne();
    if (!policy) throw new BusinessException(PolicyErrorMap.POLICY_POLICY_NOT_FOUND);
    return policy;
  }

  async findAllTypesOfLatestPolicies(): Promise<Policy[]> {
    return this.createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }
}
