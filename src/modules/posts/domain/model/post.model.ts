import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPostSnapshot } from '../interface/post-snapshot.interface';
import { IPost } from '../interface/post.interface';
import { IPostLike } from '../interface/post-like.interface';
import { IPostReport } from '../interface/post-report.interface';
import { BusinessException, PostsErrors } from 'src/common/response/errorResponse';

export class PostModel {
  private readonly id: IPost['id'];
  private readonly userId: IPost['userId'];
  private readonly viewCount: IPost['viewCount'];
  private readonly category: IPost['category'];
  private readonly createdAt: IPost['createdAt'];
  private readonly postSnapshots: IPostSnapshot[];
  private readonly likes: IPostLike[];
  private readonly reports: IPostReport[];
  private status: IPost['status'];
  private deletedAt: IPost['deletedAt'];
  private likeCount: number;
  private userLiked: boolean;

  constructor(entity: IPost, userId?: IUser['id']) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.viewCount = entity.viewCount;
    this.status = entity.status;
    this.category = entity.category;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.postSnapshots = entity.postSnapshots;
    this.likes = entity.likes || [];
    this.reports = entity.reports || [];
    this.likeCount = this.likes.length;
    this.userLiked = this.likes.some((like) => like.userId === userId);
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
      userLiked: this.userLiked,
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
    if (this.reports.filter((report) => report.status === 'PENDING').length >= 10) {
      this.status = 'INACTIVE';
    }
  }

  private validateReportAleadyExist(userId: IUser['id']): void {
    if (this.reports.some((report) => report.userId === userId)) {
      throw new BusinessException(PostsErrors.POSTS_POST_REPORT_ALREADY_EXIST);
    }
  }
}
