import { IPostLikeModelData } from '../interface/post-like.interface';

export class PostLikeModel {
  public readonly id: IPostLikeModelData['id'];
  public readonly postId: IPostLikeModelData['postId'];
  public readonly userId: IPostLikeModelData['userId'];
  public readonly createdAt: IPostLikeModelData['createdAt'];

  constructor(data: IPostLikeModelData) {
    this.id = data.id;
    this.postId = data.postId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

  toData(): IPostLikeModelData {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
