import { ICommentSnapshotModelData } from '../interface/comment-snapshot.interface';

export class CommentSnapshotModel {
  private readonly _id: ICommentSnapshotModelData['id'];
  private readonly _commentId: ICommentSnapshotModelData['commentId'];
  private readonly _body: ICommentSnapshotModelData['body'];
  private readonly _createdAt: ICommentSnapshotModelData['createdAt'];

  constructor(data: ICommentSnapshotModelData) {
    this._id = data.id;
    this._commentId = data.commentId;
    this._body = data.body;
    this._createdAt = data.createdAt;
  }

  toData(): ICommentSnapshotModelData {
    return {
      id: this._id,
      commentId: this._commentId,
      body: this._body,
      createdAt: this._createdAt,
    };
  }

  get id() {
    return this._id;
  }

  get commentId() {
    return this._commentId;
  }

  get body() {
    return this._body;
  }

  get createdAt() {
    return this._createdAt;
  }
}
