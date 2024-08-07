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
  FindBestCommentsParam,
  FindBestCommentsRet,
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
import { CommentSnapshotModel } from '../domain/model/comment-snapshot.model';

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

  async createComment({ commentCreateDto }: CreateCommentParam): Promise<CreateCommentRet> {
    const [userEntity, _postEntity] = await Promise.all([
      this.userRepository
        .findOneOrFail({ where: { id: commentCreateDto.userId }, relations: ['profileImages', 'profileImages.image'] })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      this.postRepository.findOneOrFail({ where: { id: commentCreateDto.postId, status: 'ACTIVE' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      }),
    ]);
    const newComment = new CommentModel(this.commentFactory.createComment(commentCreateDto, userEntity));
    return assert<CreateCommentRet>({
      comment: await this.commentRepository.save(newComment.toData()),
    });
  }

  async createCommentReply({ commentReplyCreateDto }: CreateCommentReplyParam): Promise<CreateCommentReplyRet> {
    const [userEntity, parentCommentEntity] = await Promise.all([
      this.userRepository
        .findOneOrFail({
          where: { id: commentReplyCreateDto.userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      this.commentRepository
        .findOneOrFail({ where: { id: commentReplyCreateDto.parentId, status: 'ACTIVE' } })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Parent Comment not found');
        }),
    ]);
    if (parentCommentEntity.parentId) throw new BusinessException(PostsErrors.POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED);
    const newCommentReply = new CommentModel(this.commentFactory.createCommentReply(commentReplyCreateDto, userEntity));
    return assert<CreateCommentReplyRet>({
      comment: await this.commentRepository.save(newCommentReply.toData()),
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

  async updateComment({ userId, commentUpdateDto }: UpdateCommentParam): Promise<UpdateCommentRet> {
    const [_userEntity, commentEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      await this.commentRepository.getCommentById(commentUpdateDto.commentId),
    ]);
    const comment = new CommentModel(commentEntity);
    const newCommentSnapshot = new CommentSnapshotModel(
      this.commentFactory.createCommentSnapshot({
        commentId: commentUpdateDto.commentId,
        body: commentUpdateDto.body,
      }),
    );
    comment.addCommentSnapshot(newCommentSnapshot);
    return assert<UpdateCommentRet>({
      comment: await this.commentRepository.save(comment.toData()),
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

  async createCommentLike({ commentLikeCreateDto }: CreateCommentLikeParam): Promise<void> {
    await Promise.all([
      this.userRepository.findOne({ where: { id: commentLikeCreateDto.userId } }).then((user) => {
        if (!user) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        return user;
      }),
      this.commentRepository
        .findOne({ where: { id: commentLikeCreateDto.commentId, status: 'ACTIVE' } })
        .then((comment) => {
          if (!comment) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          return comment;
        }),
    ]);
    const commentLike = await this.commentLikeRepository.findOne({
      where: { userId: commentLikeCreateDto.userId, commentId: commentLikeCreateDto.commentId },
    });
    if (commentLike) throw new BusinessException(PostsErrors.POSTS_COMMENT_LIKE_ALREADY_EXIST);
    const newCommentLike = this.commentFactory.createCommentLike(commentLikeCreateDto);
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

  async createCommentReport({ commentReportCreateDto }: CreateCommentReportParam): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [_user, commentEntity, commentReportEntities] = await Promise.all([
        queryRunner.manager.findOneOrFail(UserEntity, { where: { id: commentReportCreateDto.userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
        queryRunner.manager
          .findOneOrFail(CommentEntity, {
            where: { id: commentReportCreateDto.commentId },
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          }),
        queryRunner.manager.find(CommentReportEntity, {
          where: { commentId: commentReportCreateDto.commentId },
        }),
      ]);

      const alreadyExistCommentReport = commentReportEntities.find(
        (report) => report.userId === commentReportCreateDto.userId,
      );
      if (alreadyExistCommentReport) throw new BusinessException(PostsErrors.POSTS_COMMENT_REPORT_ALREADY_EXIST);
      await queryRunner.manager.save(
        CommentReportEntity,
        this.commentFactory.createCommentReport(commentReportCreateDto),
      );
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

  async findBestComments({ postId, userId }: FindBestCommentsParam): Promise<FindBestCommentsRet> {
    const commentEntity = await this.commentRepository.findBestComment(postId, userId);
    const comment = commentEntity ? new CommentModel(commentEntity) : null;
    return assert<FindBestCommentsRet>({
      comment: comment ? comment.toData() : null,
    });
  }
}
