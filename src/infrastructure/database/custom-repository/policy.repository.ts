import { Injectable } from '@nestjs/common';
import { PolicyEntity } from '../entity/policy/policy.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PolicyRepository extends Repository<PolicyEntity> {
  constructor(private dataSource: DataSource) {
    super(PolicyEntity, dataSource.createEntityManager());
  }

  findAllTypesOfLatestPolicies() {
    return this.createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }
}
