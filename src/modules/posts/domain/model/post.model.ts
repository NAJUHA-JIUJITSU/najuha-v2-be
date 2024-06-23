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

  constructor(data: IPostModelData) {
    this.id = data.id;
    this.userId = data.userId;
    this.viewCount = data.viewCount;
    this.status = data.status;
    this.category = data.category;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.likeCount = data.likeCount || 0;
    this.commentCount = data.commentCount || 0;
    this.postSnapshots = data.postSnapshots.map((snapshot) => new PostSnapshotModel(snapshot));
    this.likes = data.likes?.map((like) => new PostLikeModel(like)) || [];
    this.reports = data.reports?.map((report) => new PostReportModel(report)) || [];
    this.userLiked = this.likes.length > 0 ? true : false;
    this.user = data.user && new UserModel(data.user);
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
