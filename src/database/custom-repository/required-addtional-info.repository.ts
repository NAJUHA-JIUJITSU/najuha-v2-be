import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RequiredAdditionalInfoEntity } from '../entity/competition/required-additional-info.entity';

@Injectable()
export class RequiredAdditionalInfoRepository extends Repository<RequiredAdditionalInfoEntity> {
  constructor(private dataSource: DataSource) {
    super(RequiredAdditionalInfoEntity, dataSource.createEntityManager());
  }
}
