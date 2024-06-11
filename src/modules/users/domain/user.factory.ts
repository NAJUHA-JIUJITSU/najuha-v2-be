import { uuidv7 } from 'uuidv7';
import { ITemporaryUser, ITemporaryUserCreateDto, IUser } from './interface/user.interface';
import { IUserProfileImage, IUserProfileImageCreateDto } from './interface/user-profile-image.interface';
import { IImage } from '../../images/domain/interface/image.interface';

export class UserFactory {
  creatTemporaryUser(dto: ITemporaryUserCreateDto): ITemporaryUser {
    return {
      id: uuidv7(),
      role: 'TEMPORARY_USER',
      snsAuthProvider: dto.snsAuthProvider,
      snsId: dto.snsId,
      email: dto.email,
      name: dto.name,
      phoneNumber: dto.phoneNumber ?? null,
      gender: dto.gender ?? null,
      birth: dto.birth ?? null,
      nickname: null,
      belt: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
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
