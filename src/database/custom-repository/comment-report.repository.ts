import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CommentReportEntity } from '../entity/post/comment-report.entity';

@Injectable()
export class CommentReportRepository extends Repository<CommentReportEntity> {
  constructor(private dataSource: DataSource) {
    super(CommentReportEntity, dataSource.createEntityManager());
  }
}
