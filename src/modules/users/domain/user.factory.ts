import { uuidv7 } from 'uuidv7';
import { IUserProfileImage, IUserProfileImageCreateDto } from './interface/user-profile-image.interface';
import { IImage } from '../../images/domain/interface/image.interface';
import { TemporaryUserModel } from './model/temporary-user.model';
import { ITemporaryUser, ITemporaryUserCreateDto } from './interface/temporary-user.interface';

export class UserFactory {
  creatTemporaryUser(dto: ITemporaryUserCreateDto): ITemporaryUser {
    const temporaryUser = TemporaryUserModel.create(dto);
    return temporaryUser.toData();
  }

  createUserProfileImage(userProfileImageCreateDto: IUserProfileImageCreateDto, image: IImage): IUserProfileImage {
    return {
      id: uuidv7(),
      userId: userProfileImageCreateDto.userId,
      imageId: userProfileImageCreateDto.imageId,
      createdAt: new Date(),
      deletedAt: null,
      image: {
        ...image,
        linkedAt: new Date(),
      },
    };
  }
}
