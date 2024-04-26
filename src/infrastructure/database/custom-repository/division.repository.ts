import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DivisionEntity } from '../entity/competition/division.entity';

@Injectable()
export class DivisionRepository extends Repository<DivisionEntity> {
  constructor(private dataSource: DataSource) {
    super(DivisionEntity, dataSource.createEntityManager());
  }
}
