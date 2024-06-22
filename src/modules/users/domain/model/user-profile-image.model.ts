import { uuidv7 } from 'uuidv7';
import { IUserProfileImageCreateDto, IUserProfileImageModelData } from '../interface/user-profile-image.interface';
import { IImageModelData } from '../../../images/domain/interface/image.interface';
import { ImageModel } from '../../../images/domain/model/image.model';

export class UserProfileImageModel {
  private readonly id: IUserProfileImageModelData['id'];
  private readonly userId: IUserProfileImageModelData['userId'];
  private readonly imageId: IUserProfileImageModelData['imageId'];
  private readonly createdAt: IUserProfileImageModelData['createdAt'];
  private deletedAt: IUserProfileImageModelData['deletedAt'];
  private image?: ImageModel;

  static create(dto: IUserProfileImageCreateDto) {
    return new UserProfileImageModel({
      id: uuidv7(),
      userId: dto.userId,
      imageId: dto.imageId,
      createdAt: new Date(),
      deletedAt: null,
    });
  }

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
