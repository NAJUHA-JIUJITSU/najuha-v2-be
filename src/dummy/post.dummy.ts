import { uuidv7 } from 'uuidv7';
import { IPost } from '../modules/posts/domain/interface/post.interface';
import typia, { tags } from 'typia';
import { TId } from '../common/common-types';
import { PostSnapshotDummyBuilder } from './post-snapshot.dummy';

export class PostDummyBuilder {
  private post: Partial<IPost> = {};

  constructor(userId: TId) {
    this.post.id = uuidv7();
    this.post.userId = userId;
    this.post.viewCount = typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<1000>>();
    this.post.status = 'ACTIVE';
    this.post.category = typia.random<IPost['category']>();
    this.post.createdAt = new Date();
    this.post.deletedAt = null;
    this.post.postSnapshots = [new PostSnapshotDummyBuilder(userId, this.post.id).build()];
  }

  public setId(id: string): this {
    this.post.id = id;
    return this;
  }

  public setUserId(userId: TId): this {
    this.post.userId = userId;
    return this;
  }

  public setViewCount(viewCount: number): this {
    this.post.viewCount = viewCount;
    return this;
  }

  public setStatus(status: IPost['status']): this {
    this.post.status = status;
    return this;
  }

  public setCategory(category: IPost['category']): this {
    this.post.category = category;
    return this;
  }

  public setcreatedAt(createdAt: Date): this {
    this.post.createdAt = createdAt;
    return this;
  }

  public setDeletedAt(deletedAt: Date | null): this {
    this.post.deletedAt = deletedAt;
    return this;
  }

  public setPostSnapshots(postSnapshots: IPost['postSnapshots']): this {
    this.post.postSnapshots = postSnapshots;
    return this;
  }

  public build(): IPost {
    return this.post as IPost;
  }
}
