import { IUser } from '../../../users/domain/interface/user.interface';
import { IPostSnapshot } from '../interface/post-snapshot.interface';
import { IPost } from '../interface/post.interface';
import { IPostReport } from '../interface/post-report.interface';
import { BusinessException, PostsErrors } from '../../../../common/response/errorResponse';

export interface IPostModelData
  extends Pick<
      IPost,
      'id' | 'userId' | 'viewCount' | 'status' | 'category' | 'createdAt' | 'deletedAt' | 'postSnapshots'
    >,
    Partial<Pick<IPost, 'likes' | 'likeCount' | 'commentCount' | 'userLiked' | 'reports' | 'user'>> {}

export class PostModel {
  private readonly id: IPostModelData['id'];
  private readonly userId: IPostModelData['userId'];
  private readonly viewCount: IPostModelData['viewCount'];
  private readonly category: IPostModelData['category'];
  private postSnapshots: IPostModelData['postSnapshots'];
  private status: IPostModelData['status'];
  private deletedAt: IPostModelData['deletedAt'];
  private readonly createdAt: IPostModelData['createdAt'];
  private readonly likes: IPostModelData['likes'];
  private reports: IPostModelData['reports'];
  private likeCount: IPostModelData['likeCount'];
  private commentCount: IPostModelData['commentCount'];
  private userLiked: IPostModelData['userLiked'];
  private user: IPostModelData['user'];

  constructor(entity: IPostModelData) {
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
    if (!this.reports) {
      throw new Error('Post reports is not initialized');
    }
    this.validateReportAleadyExist(report.userId);
    this.reports.push(report);
    if (this.reports.filter((report) => report.status === 'ACCEPTED').length >= 10) {
      this.status = 'INACTIVE';
    }
  }

  private validateReportAleadyExist(userId: IUser['id']): void {
    if (!this.reports) {
      throw new Error('Post reports is not initialized');
    }
    if (this.reports.some((report) => report.userId === userId)) {
      throw new BusinessException(PostsErrors.POSTS_POST_REPORT_ALREADY_EXIST);
    }
  }
}
