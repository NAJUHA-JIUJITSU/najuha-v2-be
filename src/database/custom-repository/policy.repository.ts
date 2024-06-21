import { Injectable } from '@nestjs/common';
import { PolicyEntity } from '../entity/policy/policy.entity';
import { DataSource, Repository } from 'typeorm';
import { assert } from 'typia';
import { IPolicySummery } from '../../modules/policy/domain/interface/policy.interface';

@Injectable()
export class PolicyRepository extends Repository<PolicyEntity> {
  constructor(private dataSource: DataSource) {
    super(PolicyEntity, dataSource.createEntityManager());
  }

  async findAllTypesOfLatestPolicies(): Promise<IPolicySummery[]> {
    const policies = await this.createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .select(['policy.id', 'policy.version', 'policy.type', 'policy.isMandatory', 'policy.title', 'policy.createdAt'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
    return assert<IPolicySummery[]>(policies);
  }
}
