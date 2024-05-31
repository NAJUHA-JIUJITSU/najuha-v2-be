import { IPostLike } from '../interface/post-like.interface';

export class PostLikeModel {
  public readonly id: IPostLike['id'];
  public readonly postId: IPostLike['postId'];
  public readonly userId: IPostLike['userId'];
  public readonly createdAt: IPostLike['createdAt'];

  constructor(entity: IPostLike) {
    this.id = entity.id;
    this.postId = entity.postId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): IPostLike {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
