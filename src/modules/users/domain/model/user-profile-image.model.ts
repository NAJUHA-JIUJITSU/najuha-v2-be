import { IUserProfileImageModelData } from '../interface/user-profile-image.interface';
import { ImageModel } from '../../../images/domain/model/image.model';

export class UserProfileImageModel {
  private readonly id: IUserProfileImageModelData['id'];
  private readonly userId: IUserProfileImageModelData['userId'];
  private readonly imageId: IUserProfileImageModelData['imageId'];
  private readonly createdAt: IUserProfileImageModelData['createdAt'];
  private deletedAt: IUserProfileImageModelData['deletedAt'];
  private image?: ImageModel;

  constructor(data: IUserProfileImageModelData) {
    this.id = data.id;
    this.userId = data.userId;
    this.imageId = data.imageId;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.image = data.image && new ImageModel(data.image);
  }

  toData(): IUserProfileImageModelData {
    return {
      id: this.id,
      userId: this.userId,
      imageId: this.imageId,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      image: this.image?.toData(),
    };
  }

  delete() {
    this.deletedAt = new Date();
  }

  setImage(image: ImageModel) {
    this.image = image;
  }
}
