import { uuidv7 } from 'uuidv7';
import { IUserProfileImageCreateDto, IUserProfileImageModelData } from './interface/user-profile-image.interface';
import { IImage } from '../../images/domain/interface/image.interface';
import { ITemporaryUserCreateDto, ITemporaryUserModelData } from './interface/temporary-user.interface';
import { IPolicyConsentCreateDto, IPolicyConsentModelData } from './interface/policy-consent.interface';

export class UserFactory {
  createTemporaryUser(temporaryUserCreateDto: ITemporaryUserCreateDto): ITemporaryUserModelData {
    return {
      id: uuidv7(),
      role: 'TEMPORARY_USER',
      snsAuthProvider: temporaryUserCreateDto.snsAuthProvider,
      snsId: temporaryUserCreateDto.snsId,
      email: temporaryUserCreateDto.email,
      name: temporaryUserCreateDto.name,
      phoneNumber: temporaryUserCreateDto.phoneNumber || null,
      gender: temporaryUserCreateDto.gender || null,
      birth: temporaryUserCreateDto.birth || null,
      nickname: null,
      belt: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  createUserProfileImage(
    userProfileImageCreateDto: IUserProfileImageCreateDto,
    image: IImage,
  ): IUserProfileImageModelData {
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

  createPolicyConsent(policyConsentCreateDto: IPolicyConsentCreateDto): IPolicyConsentModelData {
    return {
      id: uuidv7(),
      userId: policyConsentCreateDto.userId,
      policyId: policyConsentCreateDto.policyId,
      createdAt: new Date(),
    };
  }
}
