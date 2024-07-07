import { ICommentModelData } from '../interface/comment.interface';
import { CommentSnapshotModel } from './comment-snapshot.model';
import { CommentLikeModel } from './comment-like.model';
import { CommentReportModel } from './comment-report.model';
import { UserModel } from '../../../users/domain/model/user.model';

export class CommentModel {
  private readonly _id: ICommentModelData['id'];
  private readonly _userId: ICommentModelData['userId'];
  private readonly _parentId: ICommentModelData['parentId'];
  private readonly _replyCount: ICommentModelData['replyCount'];
  private readonly _createdAt: ICommentModelData['createdAt'];
  private readonly _postId: ICommentModelData['postId'];
  private _deletedAt: ICommentModelData['deletedAt'];
  private _status: ICommentModelData['status'];
  private _likeCount: ICommentModelData['likeCount'];
  private _userLiked: ICommentModelData['userLiked'];
  private _commentSnapshots: CommentSnapshotModel[];
  private _likes?: CommentLikeModel[];
  private _reports?: CommentReportModel[];
  private _user?: UserModel;

  constructor(data: ICommentModelData) {
    this._id = data.id;
    this._userId = data.userId;
    this._parentId = data.parentId;
    this._replyCount = data.replyCount;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._deletedAt = data.deletedAt;
    this._postId = data.postId;
    this._likeCount = data.likeCount || 0;
    this._commentSnapshots = data.commentSnapshots.map((snapshot) => new CommentSnapshotModel(snapshot));
    this._reports = data.reports?.map((report) => new CommentReportModel(report)) || [];
    this._likes = data.likes?.map((like) => new CommentLikeModel(like)) || [];
    this._userLiked = this._likes.length > 0 ? true : false;
    this._user = data.user && new UserModel(data.user);
  }

  toData(): ICommentModelData {
    return {
      id: this._id,
      userId: this._userId,
      parentId: this._parentId,
      replyCount: this._replyCount,
      status: this._status,
      createdAt: this._createdAt,
      deletedAt: this._deletedAt,
      postId: this._postId,
      commentSnapshots: this._commentSnapshots.map((snapshot) => snapshot.toData()),
      likes: this._likes?.map((like) => like.toData()) || [],
      reports: this._reports?.map((report) => report.toData()) || [],
      likeCount: this._likeCount,
      userLiked: this._userLiked,
      user: this._user?.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get parentId() {
    return this._parentId;
  }

  get replyCount() {
    return this._replyCount;
  }

  get createdAt() {
    return this._createdAt;
  }

  get postId() {
    return this._postId;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get status() {
    return this._status;
  }

  get likeCount() {
    return this._likeCount;
  }

  get userLiked() {
    return this._userLiked;
  }

  get commentSnapshots() {
    return this._commentSnapshots;
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

  addCommentSnapshot(snapshot: CommentSnapshotModel): void {
    this._commentSnapshots.push(snapshot);
  }

  setUser(user: UserModel): void {
    this._user = user;
  }

  delete(): void {
    this._deletedAt = new Date();
  }
}
