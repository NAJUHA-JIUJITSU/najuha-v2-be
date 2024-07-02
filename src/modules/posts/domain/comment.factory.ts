import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { ICommentCreateDto, ICommentModelData, ICommentReplyCreateDto } from './interface/comment.interface';
import { ICommentSnapshotCreateDto, ICommentSnapshotModelData } from './interface/comment-snapshot.interface';
import { ICommentLikeCreateDto, ICommentLikeModelData } from './interface/comment-like.interface';
import { ICommentReportCreateDto, ICommentReportModelData } from './interface/comment-report.interface';
import { IUserModelData } from '../../users/domain/interface/user.interface';

@Injectable()
export class CommentFactory {
  createComment(commentCreateDto: ICommentCreateDto, user: IUserModelData): ICommentModelData {
    const commentId = uuidv7();
    const commentSnapshot = this.createCommentSnapshot({ commentId, body: commentCreateDto.body });
    return {
      id: commentId,
      userId: commentCreateDto.userId,
      parentId: null,
      replyCount: 0,
      status: 'ACTIVE',
      createdAt: new Date(),
      deletedAt: null,
      postId: commentCreateDto.postId,
      commentSnapshots: [commentSnapshot],
      user,
    };
  }

  createCommentReply(commentReplyCreateDto: ICommentReplyCreateDto, user: IUserModelData): ICommentModelData {
    const commentId = uuidv7();
    const commentSnapshot = this.createCommentSnapshot({ commentId, body: commentReplyCreateDto.body });
    return {
      id: commentId,
      userId: commentReplyCreateDto.userId,
      parentId: commentReplyCreateDto.parentId,
      replyCount: 0,
      status: 'ACTIVE',
      createdAt: new Date(),
      deletedAt: null,
      postId: commentReplyCreateDto.postId,
      commentSnapshots: [commentSnapshot],
      user,
    };
  }

  createCommentSnapshot({ commentId, body }: ICommentSnapshotCreateDto): ICommentSnapshotModelData {
    return {
      id: uuidv7(),
      commentId,
      body,
      createdAt: new Date(),
    };
  }

  createCommentLike({ commentId, userId }: ICommentLikeCreateDto): ICommentLikeModelData {
    return {
      id: uuidv7(),
      commentId,
      userId,
      createdAt: new Date(),
    };
  }

  createCommentReport({ type, reason, commentId, userId }: ICommentReportCreateDto): ICommentReportModelData {
    return {
      id: uuidv7(),
      type,
      status: 'ACCEPTED',
      reason,
      commentId,
      userId,
      createdAt: new Date(),
    };
  }
}
