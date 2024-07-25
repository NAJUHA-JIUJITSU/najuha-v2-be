import { uuidv7 } from 'uuidv7';
import { TId } from '../common/common-types';
import { IPostSnapshotImage } from '../modules/posts/domain/interface/post-snapshot-image.interface';
import { IImage } from '../modules/images/domain/interface/image.interface';

export class PostSnapshotImageDummyBuilder {
  private postSnapshotImage: Partial<IPostSnapshotImage> = {};

  constructor(userId: TId, postSnapshotId: TId, sequence: number = 0) {
    const image: IImage = {
      id: uuidv7(),
      userId: userId,
      path: 'post',
      format: 'image/jpeg',
      createdAt: new Date(),
      linkedAt: new Date(),
    };
    this.postSnapshotImage.id = uuidv7();
    this.postSnapshotImage.postSnapshotId = postSnapshotId;
    this.postSnapshotImage.imageId = image.id;
    this.postSnapshotImage.createdAt = new Date();
    this.postSnapshotImage.sequence = sequence;
    this.postSnapshotImage.image = image;
  }

  public setId(id: string): this {
    this.postSnapshotImage.id = id;
    return this;
  }

  public setPostSnapshotId(postSnapshotId: string): this {
    this.postSnapshotImage.postSnapshotId = postSnapshotId;
    return this;
  }

  public setImageId(imageId: string): this {
    this.postSnapshotImage.imageId = imageId;
    return this;
  }

  public setcreatedAt(createdAt: Date): this {
    this.postSnapshotImage.createdAt = createdAt;
    return this;
  }

  public setSequence(sequence: number): this {
    this.postSnapshotImage.sequence = sequence;
    return this;
  }

  public setImage(image: IPostSnapshotImage['image']): this {
    this.postSnapshotImage.image = image;
    return this;
  }

  public build(): IPostSnapshotImage {
    return this.postSnapshotImage as IPostSnapshotImage;
  }
}
