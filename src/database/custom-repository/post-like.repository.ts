import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostLikeEntity } from '../entity/post/post-like.entity';

@Injectable()
export class PostLikeRepository extends Repository<PostLikeEntity> {
  constructor(private dataSource: DataSource) {
    super(PostLikeEntity, dataSource.createEntityManager());
  }
}
