import { IPostSnapshotImageModleData } from '../interface/post-snapshot-image.interface';
import { ImageModel } from '../../../images/domain/model/image.model';

export class PostSnapshotImageModel {
  private readonly _id: IPostSnapshotImageModleData['id'];
  private readonly _postSnapshotId: IPostSnapshotImageModleData['postSnapshotId'];
  private readonly _imageId: IPostSnapshotImageModleData['imageId'];
  private readonly _sequence: IPostSnapshotImageModleData['sequence'];
  private readonly _createdAt: IPostSnapshotImageModleData['createdAt'];
  private _image: ImageModel;

  constructor(data: IPostSnapshotImageModleData) {
    this._id = data.id;
    this._postSnapshotId = data.postSnapshotId;
    this._imageId = data.imageId;
    this._sequence = data.sequence;
    this._createdAt = data.createdAt;
    this._image = data.image && new ImageModel(data.image);
  }

  toData(): IPostSnapshotImageModleData {
    return {
      id: this._id,
      postSnapshotId: this._postSnapshotId,
      imageId: this._imageId,
      sequence: this._sequence,
      createdAt: this._createdAt,
      image: this._image?.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get postSnapshotId() {
    return this._postSnapshotId;
  }

  get imageId() {
    return this._imageId;
  }

  get sequence() {
    return this._sequence;
  }

  get createdAt() {
    return this._createdAt;
  }

  get image() {
    return this._image;
  }

  setImage(image: ImageModel) {
    this._image = image;
  }
}
