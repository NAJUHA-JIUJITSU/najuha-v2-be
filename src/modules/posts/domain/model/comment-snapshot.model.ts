import { ICommentSnapshot } from '../interface/comment-snapshot.interface';

export class CommentSnapshotModel {
  public readonly id: ICommentSnapshot['id'];
  public readonly commentId: ICommentSnapshot['commentId'];
  public readonly body: ICommentSnapshot['body'];
  public readonly createdAt: ICommentSnapshot['createdAt'];

  constructor(entity: ICommentSnapshot) {
    this.id = entity.id;
    this.commentId = entity.commentId;
    this.body = entity.body;
    this.createdAt = entity.createdAt;
  }

  toEntity(): ICommentSnapshot {
    return {
      id: this.id,
      commentId: this.commentId,
      body: this.body,
      createdAt: this.createdAt,
    };
  }
}
