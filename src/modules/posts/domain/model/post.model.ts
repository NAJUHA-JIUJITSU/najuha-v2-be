import { IPostModelData } from '../interface/post.interface';
import { PostSnapshotModel } from './post-snapshot.model';
import { PostLikeModel } from './post-like.model';
import { PostReportModel } from './post-report.model';
import { UserModel } from '../../../users/domain/model/user.model';

export class PostModel {
  private readonly _id: IPostModelData['id'];
  private readonly _userId: IPostModelData['userId'];
  private readonly _viewCount: IPostModelData['viewCount'];
  private readonly _category: IPostModelData['category'];
  private readonly _likeCount: IPostModelData['likeCount'];
  private readonly _commentCount: IPostModelData['commentCount'];
  private readonly _userLiked: IPostModelData['userLiked'];
  private readonly _createdAt: IPostModelData['createdAt'];
  private _deletedAt: IPostModelData['deletedAt'];
  private _status: IPostModelData['status'];
  private _postSnapshots: PostSnapshotModel[];
  private _likes?: PostLikeModel[];
  private _reports?: PostReportModel[];
  private _user?: UserModel;

  constructor(data: IPostModelData) {
    this._id = data.id;
    this._userId = data.userId;
    this._viewCount = data.viewCount;
    this._status = data.status;
    this._category = data.category;
    this._createdAt = data.createdAt;
    this._deletedAt = data.deletedAt;
    this._likeCount = data.likeCount || 0;
    this._commentCount = data.commentCount || 0;
    this._postSnapshots = data.postSnapshots.map((snapshot) => new PostSnapshotModel(snapshot));
    this._likes = data.likes?.map((like) => new PostLikeModel(like)) || [];
    this._reports = data.reports?.map((report) => new PostReportModel(report)) || [];
    this._userLiked = this._likes.length > 0 ? true : false;
    this._user = data.user && new UserModel(data.user);
  }

  toData(): IPostModelData {
    return {
      id: this._id,
      userId: this._userId,
      viewCount: this._viewCount,
      status: this._status,
      category: this._category,
      createdAt: this._createdAt,
      deletedAt: this._deletedAt,
      likeCount: this._likeCount,
      commentCount: this._commentCount,
      userLiked: this._userLiked,
      postSnapshots: this._postSnapshots.map((snapshot) => snapshot.toData()),
      likes: this._likes?.map((like) => like.toData()),
      reports: this._reports?.map((report) => report.toData()),
      user: this._user?.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get viewCount() {
    return this._viewCount;
  }

  get category() {
    return this._category;
  }

  get likeCount() {
    return this._likeCount;
  }

  get commentCount() {
    return this._commentCount;
  }

  get userLiked() {
    return this._userLiked;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get status() {
    return this._status;
  }

  get postSnapshots() {
    return this._postSnapshots;
  }

  get likes() {
    return this._likes;
  }

  get reports() {
    return this._reports;
  }

  get user() {
    return this._user;
  }

  addPostSnapshot(snapshot: PostSnapshotModel): void {
    this._postSnapshots.push(snapshot);
  }

  setUser(user: UserModel) {
    this._user = user;
  }

  delete() {
    this._deletedAt = new Date();
  }
}
