import { IUser, IUserDisplayInfo } from '../../../users/domain/interface/user.interface';
import { IPostSnapshot } from '../interface/post-snapshot.interface';
import { IPost } from '../interface/post.interface';
import { IPostLike } from '../interface/post-like.interface';
import { IPostReport } from '../interface/post-report.interface';
import { BusinessException, PostsErrors } from '../../../../common/response/errorResponse';

export class PostModel {
  private readonly id: IPost['id'];
  private readonly userId: IPost['userId'];
  private readonly viewCount: IPost['viewCount'];
  private readonly category: IPost['category'];
  private readonly createdAt: IPost['createdAt'];
  private readonly likes: IPostLike[];
  private postSnapshots: IPostSnapshot[];
  private reports: IPostReport[];
  private status: IPost['status'];
  private deletedAt: IPost['deletedAt'];
  private likeCount: IPost['likeCount'];
  private commentCount: IPost['commentCount'];
  private userLiked: IPost['userLiked'];
  private user: IPost['user'];

  constructor(entity: IPost) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.viewCount = entity.viewCount;
    this.status = entity.status;
    this.category = entity.category;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.postSnapshots = entity.postSnapshots;
    this.likeCount = entity.likeCount || 0;
    this.commentCount = entity.commentCount || 0;
    this.reports = entity.reports || [];
    this.likes = entity.likes || [];
    this.userLiked = this.likes.length > 0 ? true : false;
    this.user = entity.user;
  }

  toEntity() {
    return {
      id: this.id,
      userId: this.userId,
      viewCount: this.viewCount,
      status: this.status,
      category: this.category,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      postSnapshots: this.postSnapshots,
      likes: this.likes,
      reports: this.reports,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      userLiked: this.userLiked,
      user: this.user,
    };
  }

  addPostSnapshot(snapshot: IPostSnapshot): void {
    this.postSnapshots.push(snapshot);
  }

  delete() {
    this.deletedAt = new Date();
  }

  addPostReport(report: IPostReport): void {
    this.validateReportAleadyExist(report.userId);
    this.reports.push(report);
    if (this.reports.filter((report) => report.status === 'ACCEPTED').length >= 10) {
      this.status = 'INACTIVE';
    }
  }

  private validateReportAleadyExist(userId: IUser['id']): void {
    if (this.reports.some((report) => report.userId === userId)) {
      throw new BusinessException(PostsErrors.POSTS_POST_REPORT_ALREADY_EXIST);
    }
  }
}
