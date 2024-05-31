import { IPostSnapshot } from '../interface/post-snapshot.interface';
import { IPost } from '../interface/post.interface';

export class PostModel {
  public readonly id: IPost['id'];
  public readonly userId: IPost['userId'];
  public readonly viewCount: IPost['viewCount'];
  public readonly status: IPost['status'];
  public readonly category: IPost['category'];
  public readonly createdAt: IPost['createdAt'];
  public deletedAt: IPost['deletedAt'];
  public readonly postSnapshots: IPostSnapshot[];

  constructor(entity: IPost) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.viewCount = entity.viewCount;
    this.status = entity.status;
    this.category = entity.category;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.postSnapshots = entity.postSnapshots;
  }

  toEntity(): IPost {
    return {
      id: this.id,
      userId: this.userId,
      viewCount: this.viewCount,
      status: this.status,
      category: this.category,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      postSnapshots: this.postSnapshots,
    };
  }

  addPostSnapshot(snapshot: IPostSnapshot): void {
    this.postSnapshots.push(snapshot);
  }

  delete() {
    this.deletedAt = new Date();
  }
}
