import { Injectable } from '@nestjs/common';
import {
  CreateCommentParam,
  CreateCommentRet,
  FindCommentsParam,
  FindCommentsRet,
  UpdateCommentParam,
  UpdateCommentRet,
  CreateCommentReplyParam,
  DeleteCommentParam,
  CreateCommentLikeParam,
  DeleteCommentLikeParam,
  CreateCommentReportParam,
  DeleteCommentReportParam,
  CreateCommentReplyRet,
  FindRepliesParam,
  FindCommentsAndRepliesParam,
} from './comments.app.dto';
import { assert } from 'typia';
import { BusinessException, CommonErrors, PostsErrors } from '../../../common/response/errorResponse';
import { ICommentModelData } from '../domain/interface/comment.interface';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { PostRepository } from '../../../database/custom-repository/post.repository';
import { CommentRepository } from '../../../database/custom-repository/comment.repository';
import { CommentModel } from '../domain/model/comment.model';
import { CommentFactory } from '../domain/comment.factory';
import { CommentLikeRepository } from '../../../database/custom-repository/comment-like.repository';
import { CommentReportRepository } from '../../../database/custom-repository/comment-report.repository';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../../database/entity/user/user.entity';
import { CommentEntity } from '../../../database/entity/post/comment.entity';
import { CommentReportEntity } from '../../../database/entity/post/comment-report.entity';

@Injectable()
export class CommentsAppService {
  constructor(
    private readonly commentFactory: CommentFactory,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly commentLikeRepository: CommentLikeRepository,
    private readonly commentReportRepository: CommentReportRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createComment(param: CreateCommentParam): Promise<CreateCommentRet> {
    const [_userEntity, _postEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: param.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.postRepository.findOneOrFail({ where: { id: param.postId, status: 'ACTIVE' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      }),
    ]);
    const newComment = this.commentFactory.createComment(param);
    await this.commentRepository.save(newComment.toData());
    return assert<CreateCommentRet>({
      comment: new CommentModel(await this.commentRepository.getCommentById(newComment.id)),
    });
  }

  async createCommentReply(param: CreateCommentReplyParam): Promise<CreateCommentReplyRet> {
    const [_userEntity, parentCommentEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: param.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.commentRepository.findOneOrFail({ where: { id: param.parentId, status: 'ACTIVE' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Parent Comment not found');
      }),
    ]);
    if (parentCommentEntity.parentId) throw new BusinessException(PostsErrors.POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED);
    const newCommentReply = this.commentFactory.createCommentReply(param);
    await this.commentRepository.save(newCommentReply.toData());
    return assert<CreateCommentReplyRet>({
      comment: new CommentModel(await this.commentRepository.getCommentById(newCommentReply.id)),
    });
  }

  async findComments(query: FindCommentsParam): Promise<FindCommentsRet> {
    const comments = assert<ICommentModelData[]>(await this.commentRepository.findComments(query)).map(
      (commentEntity) => new CommentModel(commentEntity),
    );
    let ret = assert<FindCommentsRet>({ comments: comments.map((comment) => comment.toData()) });
    if (comments.length === query.limit) ret.nextPage = query.page + 1;
    return ret;
  }

  async findReplies(query: FindRepliesParam): Promise<FindCommentsRet> {
    const comments = assert<ICommentModelData[]>(await this.commentRepository.findComments(query)).map(
      (commentEntity) => new CommentModel(commentEntity),
    );
    let ret = assert<FindCommentsRet>({ comments: comments.map((comment) => comment.toData()) });
    if (comments.length === query.limit) ret.nextPage = query.page + 1;
    return ret;
  }

  async findCommentsAndReplies(query: FindCommentsAndRepliesParam): Promise<FindCommentsRet> {
    const comments = assert<ICommentModelData[]>(await this.commentRepository.findComments(query)).map(
      (commentEntity) => new CommentModel(commentEntity),
    );
    let ret = assert<FindCommentsRet>({ comments: comments.map((comment) => comment.toData()) });
    if (comments.length === query.limit) ret.nextPage = query.page + 1;
    return ret;
  }

  async updateComment(param: UpdateCommentParam): Promise<UpdateCommentRet> {
    const [_userEntity, commentEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: param.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      assert<ICommentModelData>(
        await this.commentRepository
          .findOneOrFail({
            where: { id: param.commentId, status: 'ACTIVE', userId: param.userId },
            relations: ['commentSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          }),
      ),
    ]);
    const comment = new CommentModel(commentEntity);
    const newCommentSnapshot = this.commentFactory.createCommentSnapshot({
      commentId: param.commentId,
      body: param.body,
    });
    comment.addCommentSnapshot(newCommentSnapshot);
    await this.commentRepository.save(comment.toData());
    return assert<UpdateCommentRet>({
      comment: new CommentModel(await this.commentRepository.getCommentById(comment.id)).toData(),
    });
  }

  async deleteComment({ userId, commentId }: DeleteCommentParam): Promise<void> {
    const commentEntity = await this.commentRepository
      .findOneOrFail({ where: { userId, id: commentId, status: 'ACTIVE' } })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
      });
    this.commentRepository.softDelete(commentEntity.id);
  }

  async createCommentLike(param: CreateCommentLikeParam): Promise<void> {
    await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: param.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.commentRepository.findOneOrFail({ where: { id: param.commentId, status: 'ACTIVE' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
      }),
    ]);
    const commentLike = await this.commentLikeRepository.findOne({
      where: { userId: param.userId, commentId: param.commentId },
    });
    if (commentLike) throw new BusinessException(PostsErrors.POSTS_COMMENT_LIKE_ALREADY_EXIST);
    const newCommentLike = this.commentFactory.createCommentLike(param);
    await this.commentLikeRepository.save(newCommentLike);
  }

  async deleteCommentLike({ userId, commentId }: DeleteCommentLikeParam): Promise<void> {
    const commentLike = await this.commentLikeRepository
      .findOneOrFail({
        where: { userId, commentId },
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment Like not found');
      });
    await this.commentLikeRepository.delete(commentLike);
  }

  async createCommentReport(param: CreateCommentReportParam): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [_user, commentEntity, commentReportEntities] = await Promise.all([
        queryRunner.manager.findOneOrFail(UserEntity, { where: { id: param.userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
        queryRunner.manager
          .findOneOrFail(CommentEntity, {
            where: { id: param.commentId },
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          }),
        queryRunner.manager.find(CommentReportEntity, {
          where: { commentId: param.commentId },
        }),
      ]);

      const alreadyExistCommentReport = commentReportEntities.find((report) => report.userId === param.userId);
      if (alreadyExistCommentReport) throw new BusinessException(PostsErrors.POSTS_COMMENT_REPORT_ALREADY_EXIST);
      await queryRunner.manager.save(CommentReportEntity, this.commentFactory.createCommentReport(param));
      const acceptedReports = commentReportEntities.filter((report) => report.status === 'ACCEPTED');
      if (acceptedReports.length >= 9)
        await queryRunner.manager.update(CommentEntity, commentEntity.id, { status: 'INACTIVE' });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCommentReport({ userId, commentId }: DeleteCommentReportParam): Promise<void> {
    const commentReport = await this.commentReportRepository
      .findOneOrFail({
        where: { userId, commentId },
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment Report not found');
      });
    await this.commentReportRepository.delete(commentReport);
  }
}
