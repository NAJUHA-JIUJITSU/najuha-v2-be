import { ICommentModelData } from '../interface/comment.interface';
import { CommentSnapshotModel } from './comment-snapshot.model';
import { CommentLikeModel } from './comment-like.model';
import { CommentReportModel } from './comment-report.model';
import { UserModel } from '../../../users/domain/model/user.model';

export class CommentModel {
  public readonly id: ICommentModelData['id'];
  public readonly userId: ICommentModelData['userId'];
  private readonly parentId: ICommentModelData['parentId'];
  private readonly replyCount: ICommentModelData['replyCount'];
  private readonly createdAt: ICommentModelData['createdAt'];
  private readonly postId: ICommentModelData['postId'];
  private deletedAt: ICommentModelData['deletedAt'];
  private status: ICommentModelData['status'];
  private likeCount: ICommentModelData['likeCount'];
  private userLiked: ICommentModelData['userLiked'];
  private commentSnapshots: CommentSnapshotModel[];
  private likes?: CommentLikeModel[];
  private reports?: CommentReportModel[];
  private user?: UserModel;

  constructor(data: ICommentModelData) {
    this.id = data.id;
    this.userId = data.userId;
    this.parentId = data.parentId;
    this.replyCount = data.replyCount;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.postId = data.postId;
    this.likeCount = data.likeCount || 0;
    this.commentSnapshots = data.commentSnapshots.map((snapshot) => new CommentSnapshotModel(snapshot));
    this.reports = data.reports?.map((report) => new CommentReportModel(report)) || [];
    this.likes = data.likes?.map((like) => new CommentLikeModel(like)) || [];
    this.userLiked = this.likes.length > 0 ? true : false;
    this.user = data.user && new UserModel(data.user);
  }

  toData(): ICommentModelData {
    return {
      id: this.id,
      userId: this.userId,
      parentId: this.parentId,
      replyCount: this.replyCount,
      status: this.status,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      postId: this.postId,
      commentSnapshots: this.commentSnapshots.map((snapshot) => snapshot.toData()),
      likes: this.likes?.map((like) => like.toData()) || [],
      reports: this.reports?.map((report) => report.toData()) || [],
      likeCount: this.likeCount,
      userLiked: this.userLiked,
      user: this.user?.toData(),
    };
  }

  addCommentSnapshot(snapshot: CommentSnapshotModel): void {
    this.commentSnapshots.push(snapshot);
  }

  setUser(user: UserModel): void {
    this.user = user;
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}
