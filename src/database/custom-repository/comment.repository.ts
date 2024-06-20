import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CommentEntity } from '../entity/post/comment.entity';
import {
  IComment,
  ICommentModelData,
  IFindCommentsAndRepliesQueryOptions,
  IFindCommentsQueryOptions,
  IFindRepliesQueryOptions,
} from '../../modules/posts/domain/interface/comment.interface';
import { TPaginationParam } from '../../common/common-types';
import { BusinessException, CommonErrors } from '../../common/response/errorResponse';
import { assert } from 'typia';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(private dataSource: DataSource) {
    super(CommentEntity, dataSource.createEntityManager());
  }

  async findComments(
    query: TPaginationParam<IFindCommentsQueryOptions | IFindRepliesQueryOptions | IFindCommentsAndRepliesQueryOptions>,
  ) {
    let qb = this.createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId: query.postId })
      .leftJoinAndSelect('comment.commentSnapshots', 'commentSnapshots')
      .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.profileImages', 'profileImages')
      .leftJoinAndSelect('profileImages.image', 'profileImage');

    switch (query.type) {
      case 'COMMENT':
        qb = qb.andWhere('comment.parentId IS NULL');
        break;
      case 'REPLY':
        qb = qb.andWhere('comment.parentId IS NOT NULL');
        break;
      default:
        // do nothing for search both comments and replies
        break;
    }

    if (query.status) {
      qb = qb.andWhere('comment.status = :status', { status: query.status });
    }

    if (query.userId) {
      qb = qb.leftJoinAndSelect('comment.likes', 'likes', 'likes.userId = :userId', { userId: query.userId });
    }

    qb = qb.orderBy('comment.createdAt', 'DESC');

    return await qb
      .skip(query.page * query.limit)
      .take(query.limit)
      .getMany();
  }

  async getCommentById(commentId: IComment['id']) {
    const comment = await this.createQueryBuilder('comment')
      .where('comment.id = :commentId', { commentId })
      .andWhere('comment.status = :status', { status: 'ACTIVE' })
      .leftJoinAndSelect('comment.commentSnapshots', 'commentSnapshots')
      .loadRelationCountAndMap('comment.likeCount', 'comment.likes')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('user.profileImages', 'profileImages')
      .leftJoinAndSelect('profileImages.image', 'profileImage')
      .getOne();
    if (!comment) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
    return assert<ICommentModelData>(comment);
  }
}
