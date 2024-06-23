import { uuidv7 } from 'uuidv7';
import { ICommentSnapshotCreateDto, ICommentSnapshotModelData } from '../interface/comment-snapshot.interface';

export class CommentSnapshotModel {
  public readonly id: ICommentSnapshotModelData['id'];
  public readonly commentId: ICommentSnapshotModelData['commentId'];
  public readonly body: ICommentSnapshotModelData['body'];
  public readonly createdAt: ICommentSnapshotModelData['createdAt'];

  static create(dto: ICommentSnapshotCreateDto) {
    return new CommentSnapshotModel({
      id: uuidv7(),
      commentId: dto.commentId,
      body: dto.body,
      createdAt: new Date(),
    });
  }

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
