import { IPostCreateDto, IPostModelData } from '../interface/post.interface';
import { uuidv7 } from 'uuidv7';
import { PostSnapshotModel } from './post-snapshot.model';
import { PostLikeModel } from './post-like.model';
import { PostReportModel } from './post-report.model';
import { UserModel } from '../../../users/domain/model/user.model';

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
  private likes?: PostLikeModel[];
  private reports?: PostReportModel[];
  private user?: UserModel;

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
    this.reports = entity.reports?.map((report) => new PostReportModel(report)) || [];
    this.userLiked = this.likes.length > 0 ? true : false;
    this.user = entity.user && new UserModel(entity.user);
  }

  toData(): IPostModelData {
    return {
      id: this.id,
      userId: this.userId,
      viewCount: this.viewCount,
      status: this.status,
      category: this.category,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      likeCount: this.likeCount,
      commentCount: this.commentCount,
      userLiked: this.userLiked,
      postSnapshots: this.postSnapshots.map((snapshot) => snapshot.toData()),
      likes: this.likes?.map((like) => like.toData()),
      reports: this.reports?.map((report) => report.toData()),
      user: this.user?.toData(),
    };
  }

  addPostSnapshot(snapshot: PostSnapshotModel): void {
    this.postSnapshots.push(snapshot);
  }

  setUser(user: UserModel) {
    this.user = user;
  }

  delete() {
    this.deletedAt = new Date();
  }
}
