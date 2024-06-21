import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TemporaryUserEntity } from '../entity/user/temporary-user.entity';

@Injectable()
export class TemporaryUserRepository extends Repository<TemporaryUserEntity> {
  constructor(private dataSource: DataSource) {
    super(TemporaryUserEntity, dataSource.createEntityManager());
  }
}
