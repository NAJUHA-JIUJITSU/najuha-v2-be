import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CombinationDiscountSnapshotEntity } from '../entity/competition/combination-discount-snapshot.entity';

@Injectable()
export class CombinationDiscountSnapshotRepository extends Repository<CombinationDiscountSnapshotEntity> {
  constructor(private dataSource: DataSource) {
    super(CombinationDiscountSnapshotEntity, dataSource.createEntityManager());
  }
}
