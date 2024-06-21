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

  constructor(entity: ICommentSnapshotModelData) {
    this.id = entity.id;
    this.commentId = entity.commentId;
    this.body = entity.body;
    this.createdAt = entity.createdAt;
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
