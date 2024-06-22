import { Injectable } from '@nestjs/common';
import { UserFactory } from '../domain/user.factory';
import {
  CreateUserParam,
  CreateUserProfileImageParam,
  CreateUserProfileImageRet,
  CreateUserRet,
  DeleteProfileImage,
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

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly temporaryUserRepository: TemporaryUserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async createUser(param: CreateUserParam): Promise<CreateUserRet> {
    const temporaryUserEntity = this.userFactory.creatTemporaryUser(param);
    await this.temporaryUserRepository.save(temporaryUserEntity);
    return assert<CreateUserRet>({ user: temporaryUserEntity });
  }

  async updateUser(param: UpdateUserParam): Promise<UpdateUserRet> {
    const userModel = new UserModel(
      await this.userRepository
        .findOneOrFail({
          where: { id: param.userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
    );
    userModel.updateProfile(param);
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

  async createUserProfileImage(param: CreateUserProfileImageParam): Promise<CreateUserProfileImageRet> {
    const [userEntity, imageEntity] = await Promise.all([
      await this.userRepository
        .findOneOrFail({
          where: { id: param.userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      await this.imageRepository.findOneOrFail({ where: { id: param.imageId, path: 'user-profile' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Image not found');
      }),
    ]);
    const userModel = new UserModel(userEntity);
    const userProfileImageEntity = this.userFactory.createUserProfileImage(param, imageEntity);
    userModel.updateProfileImage(userProfileImageEntity);
    return assert<CreateUserProfileImageRet>({
      user: await this.userRepository.save(userModel.toData()),
    });
  }

  async deleteUserProfileImage({ userId }: DeleteProfileImage): Promise<void> {
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
