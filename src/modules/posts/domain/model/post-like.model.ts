import { IPostLikeModelData } from '../interface/post-like.interface';

export class PostLikeModel {
  private readonly _id: IPostLikeModelData['id'];
  private readonly _postId: IPostLikeModelData['postId'];
  private readonly _userId: IPostLikeModelData['userId'];
  private readonly _createdAt: IPostLikeModelData['createdAt'];

  constructor(data: IPostLikeModelData) {
    this._id = data.id;
    this._postId = data.postId;
    this._userId = data.userId;
    this._createdAt = data.createdAt;
  }

  toData(): IPostLikeModelData {
    return {
      id: this._id,
      postId: this._postId,
      userId: this._userId,
      createdAt: this._createdAt,
    };
  }

  get id() {
    return this._id;
  }

  get postId() {
    return this._postId;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }
}
