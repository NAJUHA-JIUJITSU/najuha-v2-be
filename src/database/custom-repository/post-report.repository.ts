import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostReportEntity } from '../entity/post/post-report.entity';

@Injectable()
export class PostReportRepository extends Repository<PostReportEntity> {
  constructor(private dataSource: DataSource) {
    super(PostReportEntity, dataSource.createEntityManager());
  }
}
