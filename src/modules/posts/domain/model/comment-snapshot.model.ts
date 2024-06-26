import { ICommentSnapshotModelData } from '../interface/comment-snapshot.interface';

export class CommentSnapshotModel {
  public readonly id: ICommentSnapshotModelData['id'];
  public readonly commentId: ICommentSnapshotModelData['commentId'];
  public readonly body: ICommentSnapshotModelData['body'];
  public readonly createdAt: ICommentSnapshotModelData['createdAt'];

  constructor(data: ICommentSnapshotModelData) {
    this.id = data.id;
    this.commentId = data.commentId;
    this.body = data.body;
    this.createdAt = data.createdAt;
  }

  toData(): ICommentSnapshotModelData {
    return {
      id: this.id,
      commentId: this.commentId,
      body: this.body,
      createdAt: this.createdAt,
    };
  }
}
