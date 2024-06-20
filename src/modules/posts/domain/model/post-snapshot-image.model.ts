import { uuidv7 } from 'uuidv7';
import { IPostSnapshotImageCreateDto, IPostSnapshotImageModleData } from '../interface/post-snapshot-image.interface';

export class PostSnapshotImageModel {
  private readonly id: IPostSnapshotImageModleData['id'];
  private readonly postSnapshotId: IPostSnapshotImageModleData['postSnapshotId'];
  private readonly imageId: IPostSnapshotImageModleData['imageId'];
  private readonly sequence: IPostSnapshotImageModleData['sequence'];
  private readonly createdAt: IPostSnapshotImageModleData['createdAt'];
  private readonly image?: IPostSnapshotImageModleData['image'];

  static create(dto: IPostSnapshotImageCreateDto) {
    return new PostSnapshotImageModel({
      id: uuidv7(),
      postSnapshotId: dto.postSnapshotId,
      imageId: dto.imageId,
      sequence: dto.sequence,
      createdAt: new Date(),
    });
  }

  constructor(data: IPostSnapshotImageModleData) {
    this.id = data.id;
    this.postSnapshotId = data.postSnapshotId;
    this.imageId = data.imageId;
    this.sequence = data.sequence;
    this.createdAt = data.createdAt;
    this.image = data.image;
  }

  toData() {
    return {
      id: this.id,
      postSnapshotId: this.postSnapshotId,
      imageId: this.imageId,
      sequence: this.sequence,
      createdAt: this.createdAt,
      image: this.image,
    };
  }
}
