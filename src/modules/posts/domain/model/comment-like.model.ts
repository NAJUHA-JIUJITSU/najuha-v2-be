import { ICommentLikeModelData } from '../interface/comment-like.interface';

export class CommentLikeModel {
  private readonly _id: ICommentLikeModelData['id'];
  private readonly _commentId: ICommentLikeModelData['commentId'];
  private readonly _userId: ICommentLikeModelData['userId'];
  private readonly _createdAt: ICommentLikeModelData['createdAt'];

  constructor(data: ICommentLikeModelData) {
    this._id = data.id;
    this._commentId = data.commentId;
    this._userId = data.userId;
    this._createdAt = data.createdAt;
  }

  toData(): ICommentLikeModelData {
    return {
      id: this._id,
      commentId: this._commentId,
      userId: this._userId,
      createdAt: this._createdAt,
    };
  }

  get id() {
    return this._id;
  }

  get commentId() {
    return this._commentId;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }
}
