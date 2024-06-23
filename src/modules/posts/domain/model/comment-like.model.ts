import { uuidv7 } from 'uuidv7';
import { ICommentLikeCreateDto, ICommentLikeModelData } from '../interface/comment-like.interface';

export class CommentLikeModel {
  public readonly id: ICommentLikeModelData['id'];
  public readonly commentId: ICommentLikeModelData['commentId'];
  public readonly userId: ICommentLikeModelData['userId'];
  public readonly createdAt: ICommentLikeModelData['createdAt'];

  static create(dto: ICommentLikeCreateDto): CommentLikeModel {
    return new CommentLikeModel({
      id: uuidv7(),
      commentId: dto.commentId,
      userId: dto.userId,
      createdAt: new Date(),
    });
  }

  constructor(data: ICommentLikeModelData) {
    this.id = data.id;
    this.commentId = data.commentId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

  toData(): ICommentLikeModelData {
    return {
      id: this.id,
      commentId: this.commentId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
