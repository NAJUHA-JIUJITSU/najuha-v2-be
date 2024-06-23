import { Injectable } from '@nestjs/common';
import { ICommentSnapshotCreateDto } from './interface/comment-snapshot.interface';
import { ICommentLikeCreateDto } from './interface/comment-like.interface';
import { ICommentReportCreateDto } from './interface/comment-report.interface';
import { CommentModel } from './model/comment.model';
import { CommentSnapshotModel } from './model/comment-snapshot.model';
import { CommentLikeModel } from './model/comment-like.model';
import { CommentReportModel } from './model/comment-report.model';
import { CreateCommentParam, CreateCommentReplyParam } from '../application/comments.app.dto';
import { IUserModelData } from '../../users/domain/interface/user.interface';
import { UserModel } from '../../users/domain/model/user.model';

@Injectable()
export class CommentFactory {
  createComment(commentCreateParam: CreateCommentParam, user: IUserModelData): CommentModel {
    const commentModel = CommentModel.createComment({
      userId: commentCreateParam.userId,
      postId: commentCreateParam.postId,
    });
    const commentSnapshotModel = CommentSnapshotModel.create({
      commentId: commentModel.id,
      body: commentCreateParam.body,
    });
    const userModel = new UserModel(user);
    commentModel.addCommentSnapshot(commentSnapshotModel);
    commentModel.setUser(userModel);
    return commentModel;
  }

  createCommentReply(commentReplyCreateDto: CreateCommentReplyParam, user: IUserModelData): CommentModel {
    const commentModel = CommentModel.createReply({
      userId: commentReplyCreateDto.userId,
      postId: commentReplyCreateDto.postId,
      parentId: commentReplyCreateDto.parentId,
    });
    const commentSnapshotModel = CommentSnapshotModel.create({
      commentId: commentModel.id,
      body: commentReplyCreateDto.body,
    });
    const userModel = new UserModel(user);
    commentModel.addCommentSnapshot(commentSnapshotModel);
    commentModel.setUser(userModel);
    return commentModel;
  }

  createCommentSnapshot(commentSnapshotCreateDto: ICommentSnapshotCreateDto): CommentSnapshotModel {
    return CommentSnapshotModel.create({
      commentId: commentSnapshotCreateDto.commentId,
      body: commentSnapshotCreateDto.body,
    });
  }

  createCommentLike({ commentId, userId }: ICommentLikeCreateDto): CommentLikeModel {
    return CommentLikeModel.create({
      commentId,
      userId,
    });
  }

  createCommentReport({ type, reason, commentId, userId }: ICommentReportCreateDto): CommentReportModel {
    return CommentReportModel.create({
      type,
      reason,
      commentId,
      userId,
    });
  }
}
