import { IUser } from '../../../users/domain/interface/user.interface';
import { ICommentLike } from '../interface/comment-like.interface';
import { ICommentReport } from '../interface/comment-report.interface';
import { ICommentSnapshot } from '../interface/comment-snapshot.interface';
import { IComment } from '../interface/comment.interface';
import { BusinessException, PostsErrors } from '../../../../common/response/errorResponse';

export class CommentModel {
  private readonly id: IComment['id'];
  private readonly userId: IComment['userId'];
  private readonly parentId: IComment['parentId'];
  private readonly createdAt: IComment['createdAt'];
  private readonly postId: IComment['postId'];
  private readonly commentSnapshots: ICommentSnapshot[];
  private readonly likes: ICommentLike[];
  private readonly reports: ICommentReport[];
  private deletedAt: IComment['deletedAt'];
  private status: IComment['status'];
  private likeCount: IComment['likeCount'];
  private userLiked: IComment['userLiked'];
  private user: IComment['user'];

  constructor(entity: IComment) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.parentId = entity.parentId;
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.postId = entity.postId;
    this.commentSnapshots = entity.commentSnapshots;
    this.likeCount = entity.likeCount || 0;
    this.reports = entity.reports || [];
    this.likes = entity.likes || [];
    this.userLiked = this.likes.length > 0 ? true : false;
    this.user = entity.user;
  }

  toEntity() {
    return {
      id: this.id,
      userId: this.userId,
      parentId: this.parentId,
      status: this.status,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      postId: this.postId,
      commentSnapshots: this.commentSnapshots,
      likes: this.likes,
      reports: this.reports,
      likeCount: this.likeCount,
      userLiked: this.userLiked,
      user: this.user,
    };
  }

  addCommentSnapshot(snapshot: ICommentSnapshot): void {
    this.commentSnapshots.push(snapshot);
  }

  delete(): void {
    this.deletedAt = new Date();
  }

  addCommentReport(report: ICommentReport): void {
    this.validateReportAlreadyExist(report.userId);
    this.reports.push(report);
    if (this.reports.filter((report) => report.status === 'ACCEPTED').length >= 10) {
      this.status = 'INACTIVE';
    }
  }

  private validateReportAlreadyExist(userId: IUser['id']): void {
    if (this.reports.some((report) => report.userId === userId)) {
      throw new BusinessException(PostsErrors.POSTS_COMMENT_REPORT_ALREADY_EXIST);
    }
  }
}
