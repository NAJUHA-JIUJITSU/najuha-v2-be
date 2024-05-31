import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CommentLikeEntity } from '../entity/post/comment-like.entity';

@Injectable()
export class CommentLikeRepository extends Repository<CommentLikeEntity> {
  constructor(private dataSource: DataSource) {
    super(CommentLikeEntity, dataSource.createEntityManager());
  }
}
