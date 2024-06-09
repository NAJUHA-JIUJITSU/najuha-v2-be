import { uuidv7 } from 'uuidv7';
import { ITemporaryUser, ITemporaryUserCreateDto, IUser } from './interface/user.interface';
import {
  IUserProfileImageSnapshot,
  IUserProfileImageSnapshotCreateDto,
} from './interface/user-profile-image.interface';
import { IImage } from 'src/modules/images/domain/interface/image.interface';

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
      profileImageUrlKey: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  createUserProfileImage(
    userProfileImageSnapshotCreateDto: IUserProfileImageSnapshotCreateDto,
    image: IImage,
  ): IUserProfileImageSnapshot {
    return {
      id: uuidv7(),
      userId: userProfileImageSnapshotCreateDto.userId,
      imageId: userProfileImageSnapshotCreateDto.imageId,
      createdAt: new Date(),
      image,
    };
  }
}
