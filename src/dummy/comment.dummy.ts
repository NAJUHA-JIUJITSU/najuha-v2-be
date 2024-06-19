import { uuidv7 } from 'uuidv7';
import { TId } from '../common/common-types';
import { IComment } from '../modules/posts/domain/interface/comment.interface';
import { ICommentSnapshot } from '../modules/posts/domain/interface/comment-snapshot.interface';

export class CommentDummyBuilder {
  private comment: Partial<IComment> = {};

  constructor(userId: TId, postId: TId, parentId?: TId) {
    this.comment.id = uuidv7();
    this.comment.userId = userId;
    this.comment.status = 'ACTIVE';
    this.comment.createdAt = new Date();
    this.comment.deletedAt = null;
    this.comment.postId = postId;
    this.comment.parentId = parentId || null;
    const commentSnapthos: ICommentSnapshot = {
      id: uuidv7(),
      commentId: this.comment.id,
      body: `${parentId ? 'Reply' : 'Comment'} body`,
      createdAt: new Date(),
    };
    this.comment.commentSnapshots = [commentSnapthos];
  }

  public setId(id: string): this {
    this.comment.id = id;
    return this;
  }

  public setUserId(userId: TId): this {
    this.comment.userId = userId;
    return this;
  }

  public setStatus(status: IComment['status']): this {
    this.comment.status = status;
    return this;
  }

  public setCreatedAt(createdAt: Date): this {
    this.comment.createdAt = createdAt;
    return this;
  }

  public setDeletedAt(deletedAt: Date | null): this {
    this.comment.deletedAt = deletedAt;
    return this;
  }

  public setCommentSnapshots(commentSnapshots: IComment['commentSnapshots']): this {
    this.comment.commentSnapshots = commentSnapshots;
    return this;
  }

  public build(): IComment {
    return this.comment as IComment;
  }
}
