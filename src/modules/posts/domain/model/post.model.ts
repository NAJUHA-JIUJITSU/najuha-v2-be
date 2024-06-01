import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPostSnapshot } from '../interface/post-snapshot.interface';
import { IPost, IPostRet } from '../interface/post.interface';
import { IPostLike } from '../interface/post-like.interface';

export class PostModel {
  private readonly id: IPost['id'];
  private readonly userId: IPost['userId'];
  private readonly viewCount: IPost['viewCount'];
  private readonly status: IPost['status'];
  private readonly category: IPost['category'];
  private readonly createdAt: IPost['createdAt'];
  private deletedAt: IPost['deletedAt'];
  private readonly postSnapshots: IPostSnapshot[];
  private readonly likes: IPostLike[];
  private likeCount: number;
  private userLiked: boolean;

  constructor(entity: IPost, userId?: IUser['id']) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.viewCount = entity.viewCount;
    this.status = entity.status;
    this.category = entity.category;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.postSnapshots = entity.postSnapshots;
    this.likes = entity.likes || [];
    this.likeCount = this.likes.length;
    this.userLiked = this.likes.some((like) => like.userId === userId);
  }

  toEntity(): IPostRet {
    return {
      id: this.id,
      userId: this.userId,
      viewCount: this.viewCount,
      status: this.status,
      category: this.category,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      postSnapshots: this.postSnapshots,
      likeCount: this.likeCount,
      userLiked: this.userLiked,
    };
  }

  addPostSnapshot(snapshot: IPostSnapshot): void {
    this.postSnapshots.push(snapshot);
  }

  delete() {
    this.deletedAt = new Date();
  }
}
