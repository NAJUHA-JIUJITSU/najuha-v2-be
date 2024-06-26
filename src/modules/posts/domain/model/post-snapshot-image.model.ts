import { IPostSnapshotImageModleData } from '../interface/post-snapshot-image.interface';
import { ImageModel } from '../../../images/domain/model/image.model';

export class PostSnapshotImageModel {
  private readonly id: IPostSnapshotImageModleData['id'];
  private readonly postSnapshotId: IPostSnapshotImageModleData['postSnapshotId'];
  private readonly imageId: IPostSnapshotImageModleData['imageId'];
  private readonly sequence: IPostSnapshotImageModleData['sequence'];
  private readonly createdAt: IPostSnapshotImageModleData['createdAt'];
  private image: ImageModel;

  constructor(data: IPostSnapshotImageModleData) {
    this.id = data.id;
    this.postSnapshotId = data.postSnapshotId;
    this.imageId = data.imageId;
    this.sequence = data.sequence;
    this.createdAt = data.createdAt;
    this.image = data.image && new ImageModel(data.image);
  }

  toData(): IPostSnapshotImageModleData {
    return {
      id: this.id,
      postSnapshotId: this.postSnapshotId,
      imageId: this.imageId,
      sequence: this.sequence,
      createdAt: this.createdAt,
      image: this.image?.toData(),
    };
  }

  setImage(image: ImageModel) {
    this.image = image;
  }
}
