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
  FindCommentRepliesParam,
} from './comments.app.dto';
import { assert } from 'typia';
import { BusinessException, CommonErrors, PostsErrors } from 'src/common/response/errorResponse';
import { IComment } from '../domain/interface/comment.interface';
import { UserRepository } from 'src/database/custom-repository/user.repository';
import { PostRepository } from 'src/database/custom-repository/post.repository';
import { CommentRepository } from 'src/database/custom-repository/comment.repository';
import { CommentModel } from '../domain/model/comment.model';
import { CommentFactory } from '../domain/comment.factory';
import { CommentLikeRepository } from 'src/database/custom-repository/comment-like.repository';
import { CommentReportRepository } from 'src/database/custom-repository/comment-report.repository';
import { IsNull } from 'typeorm';

@Injectable()
export class CommentsAppService {
  constructor(
    private readonly commentFactory: CommentFactory,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
    private readonly commentLikeRepository: CommentLikeRepository,
    private readonly commentReportRepository: CommentReportRepository,
  ) {}

  async createComment({ commentCreateDto }: CreateCommentParam): Promise<CreateCommentRet> {
    await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: commentCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.postRepository.findOneOrFail({ where: { id: commentCreateDto.postId, status: 'ACTIVE' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      }),
    ]);
    const comment = new CommentModel(this.commentFactory.createComment(commentCreateDto));
    return { comment: await this.commentRepository.save(comment.toEntity()) };
  }

  async createCommentReply({ commentReplyCreateDto }: CreateCommentReplyParam): Promise<CreateCommentReplyRet> {
    const [_, parentComment] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: commentReplyCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.commentRepository
        .findOneOrFail({ where: { id: commentReplyCreateDto.parentId, status: 'ACTIVE' } })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Parent Comment not found');
        }),
    ]);
    if (parentComment.parentId) throw new BusinessException(PostsErrors.POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED);
    const commentReply = new CommentModel(this.commentFactory.createCommentReply(commentReplyCreateDto));
    return { comment: await this.commentRepository.save(commentReply.toEntity()) };
  }

  async findComments({ userId, postId, page, limit }: FindCommentsParam): Promise<FindCommentsRet> {
    const comments = assert<IComment[]>(
      await this.commentRepository.find({
        where: { postId, parentId: IsNull(), status: 'ACTIVE' },
        relations: ['commentSnapshots', 'likes'],
        skip: page * limit,
        take: limit,
      }),
    ).map((commentEntity) => new CommentModel(commentEntity, userId));
    let ret: FindCommentsRet = { comments: comments.map((comment) => comment.toEntity()) };
    if (comments.length === limit) {
      ret = { ...ret, nextPage: page + 1 };
    }
    return ret;
  }

  async findCommentReplies({ userId, parentId, page, limit }: FindCommentRepliesParam): Promise<FindCommentsRet> {
    const comments = assert<IComment[]>(
      await this.commentRepository.find({
        where: { parentId, status: 'ACTIVE' },
        relations: ['commentSnapshots', 'likes'],
        skip: page * limit,
        take: limit,
      }),
    ).map((commentEntity) => new CommentModel(commentEntity, userId));
    let ret: FindCommentsRet = { comments: comments.map((comment) => comment.toEntity()) };
    if (comments.length === limit) {
      ret = { ...ret, nextPage: page + 1 };
    }
    return ret;
  }

  async updateComment({ userId, commentUpdateDto }: UpdateCommentParam): Promise<UpdateCommentRet> {
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository
          .findOneOrFail({
            where: { id: commentUpdateDto.commentId, userId, status: 'ACTIVE' },
            relations: ['commentSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          }),
      ),
    );
    const newCommentSnapshot = this.commentFactory.createCommentSnapshot(
      commentUpdateDto.commentId,
      commentUpdateDto.body,
    );
    comment.addCommentSnapshot(newCommentSnapshot);
    return { comment: await this.commentRepository.save(comment.toEntity()) };
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
      this.userRepository.findOneOrFail({ where: { id: commentLikeCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.commentRepository
        .findOneOrFail({ where: { id: commentLikeCreateDto.commentId, status: 'ACTIVE' } })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
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
    const [_, commentEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: commentReportCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.commentRepository
        .findOneOrFail({
          where: { id: commentReportCreateDto.commentId },
          relations: ['commentSnapshots', 'reports'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
    ]);
    const comment = new CommentModel(assert<IComment>(commentEntity));
    comment.addCommentReport(this.commentFactory.createCommentReport(commentReportCreateDto));
    this.commentRepository.save(comment.toEntity());
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
