import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PolicyConsentEntity } from '../entity/user/policy-consent.entity';

@Injectable()
export class PolicyConsentRepository extends Repository<PolicyConsentEntity> {
  constructor(private dataSource: DataSource) {
    super(PolicyConsentEntity, dataSource.createEntityManager());
  }
}
