import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { IComment, ICommentCreateDto, ICommentReplyCreateDto } from './interface/comment.interface';
import { ICommentSnapshot } from './interface/comment-snapshot.interface';
import { ICommentLike, ICommentLikeCreateDto } from './interface/comment-like.interface';
import { ICommentReport, ICommentReportCreateDto } from './interface/comment-report.interface';

@Injectable()
export class CommentFactory {
  createComment(commentCreateDto: ICommentCreateDto): IComment {
    const commentId = uuidv7();
    const commentSnapshot = this.createCommentSnapshot(commentId, commentCreateDto.body);
    return {
      id: commentId,
      userId: commentCreateDto.userId,
      parentId: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      deletedAt: null,
      postId: commentCreateDto.postId,
      commentSnapshots: [commentSnapshot],
    };
  }

  createCommentReply(commentReplyCreateDto: ICommentReplyCreateDto): IComment {
    const commentId = uuidv7();
    const commentSnapshot = this.createCommentSnapshot(commentId, commentReplyCreateDto.body);
    return {
      id: commentId,
      userId: commentReplyCreateDto.userId,
      parentId: commentReplyCreateDto.parentId,
      status: 'ACTIVE',
      createdAt: new Date(),
      deletedAt: null,
      postId: commentReplyCreateDto.postId,
      commentSnapshots: [commentSnapshot],
    };
  }

  createCommentSnapshot(commentId: IComment['id'], body: ICommentSnapshot['body']): ICommentSnapshot {
    return {
      id: uuidv7(),
      commentId,
      body,
      createdAt: new Date(),
    };
  }

  createCommentLike({ commentId, userId }: ICommentLikeCreateDto): ICommentLike {
    return {
      id: uuidv7(),
      commentId,
      userId,
      createdAt: new Date(),
    };
  }

  createCommentReport({ type, reason, commentId, userId }: ICommentReportCreateDto): ICommentReport {
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
