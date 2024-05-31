import { ICommentSnapshot } from '../interface/comment-snapshot.interface';
import { IComment } from '../interface/comment.interface';

export class CommentModel {
  public readonly id: IComment['id'];
  public readonly userId: IComment['userId'];
  public readonly parentId: IComment['parentId'];
  public readonly status: IComment['status'];
  public readonly createdAt: IComment['createdAt'];
  public deletedAt: IComment['deletedAt'];
  public readonly postId: IComment['postId'];
  public readonly commentSnapshots: ICommentSnapshot[];

  constructor(entity: IComment) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.parentId = entity.parentId;
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.postId = entity.postId;
    this.commentSnapshots = entity.commentSnapshots;
  }

  toEntity(): IComment {
    return {
      id: this.id,
      userId: this.userId,
      parentId: this.parentId,
      status: this.status,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      postId: this.postId,
      commentSnapshots: this.commentSnapshots,
    };
  }

  addCommentSnapshot(snapshot: ICommentSnapshot): void {
    this.commentSnapshots.push(snapshot);
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}
