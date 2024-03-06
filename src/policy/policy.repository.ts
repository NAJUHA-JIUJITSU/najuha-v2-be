import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { PolicyEntity } from './entities/policy.entity';

// TODO 에러 표준화
@Injectable()
export class PolicyRepository extends Repository<PolicyEntity> {
  constructor(private dataSource: DataSource) {
    super(PolicyEntity, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<PolicyEntity, 'id'> & Partial<PolicyEntity>): Promise<PolicyEntity> {
    const policy = await this.findOne({ where: { id: dto.id } });
    if (!policy) throw new Error('Policy not found');
    return await this.save({ ...policy, ...dto });
  }

  async updateOrFail(dto: Pick<PolicyEntity, 'id'> & Partial<PolicyEntity>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new Error('Policy not found');
  }

  async getOneOrFail(where: FindOptionsWhere<PolicyEntity>): Promise<PolicyEntity> {
    const policy = await this.findOne({ where });
    if (!policy) throw new Error('Policy not found');
    return policy;
  }

  async getOneLatestPolicyByTypeOrFail(type: PolicyEntity['type']): Promise<PolicyEntity> {
    const policy = await this.createQueryBuilder('policy')
      .where('policy.type = :type', { type })
      .orderBy('policy.createdAt', 'DESC')
      .getOne();
    if (!policy) throw new Error('Policy not found');
    return policy;
  }

  async findAllTypesOfLatestPolicies(): Promise<PolicyEntity[]> {
    return this.createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }

  async findAllLatestMandatoryPolicies(): Promise<PolicyEntity[]> {
    return this.createQueryBuilder('policy')
      .where('policy.isMandatory = true')
      .orderBy('policy.createdAt', 'DESC')
      .getMany();
  }
}
