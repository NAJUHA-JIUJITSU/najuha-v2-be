import { IUser } from '../../../users/domain/interface/user.interface';
import { IPostCreateDto, IPostModelData } from '../interface/post.interface';
import { IPostReport } from '../interface/post-report.interface';
import { BusinessException, PostsErrors } from '../../../../common/response/errorResponse';
import { uuidv7 } from 'uuidv7';
import { PostSnapshotModel } from './post-snapshot.model';
import { PostLikeModel } from './post-like.model';

export class PostModel {
  public readonly id: IPostModelData['id'];
  public readonly userId: IPostModelData['userId'];
  private readonly viewCount: IPostModelData['viewCount'];
  private readonly category: IPostModelData['category'];
  private readonly likeCount: IPostModelData['likeCount'];
  private readonly commentCount: IPostModelData['commentCount'];
  private readonly userLiked: IPostModelData['userLiked'];
  private readonly createdAt: IPostModelData['createdAt'];
  private deletedAt: IPostModelData['deletedAt'];
  private status: IPostModelData['status'];
  private postSnapshots: PostSnapshotModel[];
  private readonly likes?: PostLikeModel[];
  private reports?: IPostModelData['reports'];
  private user?: IPostModelData['user'];

  static create(dto: IPostCreateDto) {
    return new PostModel({
      id: uuidv7(),
      userId: dto.userId,
      viewCount: 0,
      status: 'ACTIVE',
      category: dto.category,
      createdAt: new Date(),
      deletedAt: null,
      postSnapshots: [],
    });
  }

  constructor(entity: IPostModelData) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.viewCount = entity.viewCount;
    this.status = entity.status;
    this.category = entity.category;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.likeCount = entity.likeCount || 0;
    this.commentCount = entity.commentCount || 0;
    this.postSnapshots = entity.postSnapshots.map((snapshot) => new PostSnapshotModel(snapshot));
    this.likes = entity.likes?.map((like) => new PostLikeModel(like)) || [];
    this.userLiked = this.likes.length > 0 ? true : false;
    this.reports = entity.reports || [];
    this.user = entity.user;
  }

  toEntity(): IPostModelData {
    return {
      id: this.id,
      userId: this.userId,
      viewCount: this.viewCount,
      status: this.status,
      category: this.category,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      reports: this.reports,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      userLiked: this.userLiked,
      postSnapshots: this.postSnapshots.map((snapshot) => snapshot.toEntity()),
      likes: this.likes?.map((like) => like.toData()),
      user: this.user,
    };
  }

  addPostSnapshot(snapshot: PostSnapshotModel): void {
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
