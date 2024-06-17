import { uuidv7 } from 'uuidv7';
import { IPostSnapshot } from '../modules/posts/domain/interface/post-snapshot.interface';
import { TId } from '../common/common-types';
import { PostSnapshotImageDummyBuilder } from './post-snapshot-image.dummy';
import typia, { tags } from 'typia';

export class PostSnapshotDummyBuilder {
  private postSnaphsot: Partial<IPostSnapshot> = {};

  constructor(userId: TId, postId: TId) {
    this.postSnaphsot.id = uuidv7();
    this.postSnaphsot.postId = postId;
    this.postSnaphsot.title = `Post title ${this.postSnaphsot.id}`;
    this.postSnaphsot.body = `Post body ${this.postSnaphsot.id}`;
    this.postSnaphsot.createdAt = new Date();
    const imageCount = typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<5>>();
    const postSnapshotImages: IPostSnapshot['postSnapshotImages'] = [];
    for (let imageSequence = 0; imageSequence < imageCount; imageSequence++) {
      postSnapshotImages.push(new PostSnapshotImageDummyBuilder(userId, this.postSnaphsot.id, imageSequence).build());
    }
    this.postSnaphsot.postSnapshotImages = postSnapshotImages;
  }

  public setId(id: string): this {
    this.postSnaphsot.id = id;
    return this;
  }

  public setPostId(postId: string): this {
    this.postSnaphsot.postId = postId;
    return this;
  }

  public setTitle(title: string): this {
    this.postSnaphsot.title = title;
    return this;
  }

  public setBody(body: string): this {
    this.postSnaphsot.body = body;
    return this;
  }

  public setCreatedAt(createdAt: Date): this {
    this.postSnaphsot.createdAt = createdAt;
    return this;
  }

  public setPostSnapshotImages(postSnapshotImages: IPostSnapshot['postSnapshotImages']): this {
    this.postSnaphsot.postSnapshotImages = postSnapshotImages;
    return this;
  }

  public build(): IPostSnapshot {
    return this.postSnaphsot as IPostSnapshot;
  }
}
