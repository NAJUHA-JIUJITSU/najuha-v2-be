import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EarlybirdDiscountSnapshotEntity } from '../entity/competition/earlybird-discount-snapshot.entity';

@Injectable()
export class EarlybirdDiscountSnapshotRepository extends Repository<EarlybirdDiscountSnapshotEntity> {
  constructor(private dataSource: DataSource) {
    super(EarlybirdDiscountSnapshotEntity, dataSource.createEntityManager());
  }
}
