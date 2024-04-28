import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RequiredAddtionalInfoEntity } from '../entity/competition/required-addtional-info.entity';

@Injectable()
export class RequiredAddtionalInfoRepository extends Repository<RequiredAddtionalInfoEntity> {
  constructor(private dataSource: DataSource) {
    super(RequiredAddtionalInfoEntity, dataSource.createEntityManager());
  }
}
