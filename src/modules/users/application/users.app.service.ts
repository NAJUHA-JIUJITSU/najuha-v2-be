import { Injectable } from '@nestjs/common';
import { UserFactory } from '../domain/user.factory';
import {
  CreateUserParam,
  CreateUserProfileImageParam,
  CreateUserProfileImageRet,
  CreateUserRet,
  DeleteProfileImageParam,
  GetMeParam,
  GetMeRet,
  UpdateUserParam,
  UpdateUserRet,
} from './users.app.dtos';
import { assert } from 'typia';
import { IUser } from '../domain/interface/user.interface';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { BusinessException, CommonErrors } from '../../../common/response/errorResponse';
import { ImageRepository } from '../../../database/custom-repository/image.repository';
import { UserModel } from '../domain/model/user.model';
import { TemporaryUserRepository } from '../../../database/custom-repository/temporary-user.repository';
import { UserProfileImageModel } from '../domain/model/user-profile-image.model';

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly temporaryUserRepository: TemporaryUserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async createUser({ userCreateDto }: CreateUserParam): Promise<CreateUserRet> {
    const temporaryUserEntity = this.userFactory.createTemporaryUser(userCreateDto);
    await this.temporaryUserRepository.save(temporaryUserEntity);
    return assert<CreateUserRet>({ user: temporaryUserEntity });
  }

  async updateUser({ userUpdateDto }: UpdateUserParam): Promise<UpdateUserRet> {
    const userModel = new UserModel(
      await this.userRepository
        .findOneOrFail({
          where: { id: userUpdateDto.id },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
    );
    userModel.updateProfile(userUpdateDto);
    return assert<UpdateUserRet>({ user: await this.userRepository.save(userModel.toData()) });
  }

  async getMe({ userId }: GetMeParam): Promise<GetMeRet> {
    const userEntity = assert<IUser>(
      await this.userRepository
        .findOneOrFail({
          where: { id: userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
    );
    return assert<GetMeRet>({ user: userEntity });
  }

  async createUserProfileImage({
    userProfileImageCreateDto,
  }: CreateUserProfileImageParam): Promise<CreateUserProfileImageRet> {
    const [userEntity, imageEntity] = await Promise.all([
      await this.userRepository
        .findOneOrFail({
          where: { id: userProfileImageCreateDto.userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      await this.imageRepository
        .findOneOrFail({ where: { id: userProfileImageCreateDto.imageId, path: 'user-profile' } })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Image not found');
        }),
    ]);
    const userModel = new UserModel(userEntity);
    const userProfileImageModel = new UserProfileImageModel(
      this.userFactory.createUserProfileImage(userProfileImageCreateDto, imageEntity),
    );
    userModel.updateProfileImage(userProfileImageModel);
    return assert<CreateUserProfileImageRet>({
      user: await this.userRepository.save(userModel.toData()),
    });
  }

  async deleteUserProfileImage({ userId }: DeleteProfileImageParam): Promise<void> {
    const userEntity = await this.userRepository
      .findOneOrFail({
        where: { id: userId },
        relations: ['profileImages', 'profileImages.image'],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      });
    const user = new UserModel(userEntity);
    user.deleteProfileImage();
    await this.userRepository.save(user.toData());
  }
}
