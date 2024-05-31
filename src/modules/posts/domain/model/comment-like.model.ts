import { ICommentLike } from '../interface/comment-like.interface';

export class CommentLikeModel {
  public readonly id: ICommentLike['id'];
  public readonly commentId: ICommentLike['commentId'];
  public readonly userId: ICommentLike['userId'];
  public readonly createdAt: ICommentLike['createdAt'];

  constructor(entity: ICommentLike) {
    this.id = entity.id;
    this.commentId = entity.commentId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): ICommentLike {
    return {
      id: this.id,
      commentId: this.commentId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
