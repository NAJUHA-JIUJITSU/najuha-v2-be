import { IUserProfileImageCreateDto } from './interface/user-profile-image.interface';
import { TemporaryUserModel } from './model/temporary-user.model';
import { ITemporaryUser, ITemporaryUserCreateDto } from './interface/temporary-user.interface';
import { UserProfileImageModel } from './model/user-profile-image.model';
import { IImageModelData } from '../../images/domain/interface/image.interface';

export class UserFactory {
  creatTemporaryUser(dto: ITemporaryUserCreateDto): ITemporaryUser {
    const temporaryUser = TemporaryUserModel.create(dto);
    return temporaryUser.toData();
  }

  createUserProfileImage(
    userProfileImageCreateDto: IUserProfileImageCreateDto,
    image?: IImageModelData,
  ): UserProfileImageModel {
    return UserProfileImageModel.create(userProfileImageCreateDto, image);
  }
}
