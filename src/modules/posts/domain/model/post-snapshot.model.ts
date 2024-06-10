import { IPostSnapshot } from '../interface/post-snapshot.interface';

export class PostSnapshotModel {
  public readonly id: IPostSnapshot['id'];
  public readonly postId: IPostSnapshot['postId'];
  public readonly title: IPostSnapshot['title'];
  public readonly body: IPostSnapshot['body'];
  public readonly createdAt: IPostSnapshot['createdAt'];
  public postSnapshotImages: IPostSnapshot['postSnapshotImages'];

  constructor(entity: IPostSnapshot) {
    this.id = entity.id;
    this.postId = entity.postId;
    this.title = entity.title;
    this.body = entity.body;
    this.createdAt = entity.createdAt;
    this.postSnapshotImages = entity.postSnapshotImages;
  }

  toEntity(): IPostSnapshot {
    return {
      id: this.id,
      postId: this.postId,
      title: this.title,
      body: this.body,
      createdAt: this.createdAt,
      postSnapshotImages: this.postSnapshotImages,
    };
  }
}
