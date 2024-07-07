import { IUserProfileImageModelData } from '../interface/user-profile-image.interface';
import { ImageModel } from '../../../images/domain/model/image.model';

export class UserProfileImageModel {
  private readonly _id: IUserProfileImageModelData['id'];
  private readonly _userId: IUserProfileImageModelData['userId'];
  private readonly _imageId: IUserProfileImageModelData['imageId'];
  private readonly _createdAt: IUserProfileImageModelData['createdAt'];
  private _deletedAt: IUserProfileImageModelData['deletedAt'];
  private _image?: ImageModel;

  constructor(data: IUserProfileImageModelData) {
    this._id = data.id;
    this._userId = data.userId;
    this._imageId = data.imageId;
    this._createdAt = data.createdAt;
    this._deletedAt = data.deletedAt;
    this._image = data.image && new ImageModel(data.image);
  }

  toData(): IUserProfileImageModelData {
    return {
      id: this._id,
      userId: this._userId,
      imageId: this._imageId,
      createdAt: this._createdAt,
      deletedAt: this._deletedAt,
      image: this._image?.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get imageId() {
    return this._imageId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get image() {
    return this._image;
  }

  delete() {
    this._deletedAt = new Date();
  }

  setImage(image: ImageModel) {
    this._image = image;
  }
}
