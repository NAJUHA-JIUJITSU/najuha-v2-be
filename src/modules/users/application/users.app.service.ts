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
import { UserRepository } from 'src//database/custom-repository/user.repository';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { ImageRepository } from 'src/database/custom-repository/image.repository';
import { IImage } from 'src/modules/images/domain/interface/image.interface';
import { UserModel } from '../domain/model/user.model';

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async createUser({ userCreateDto }: CreateUserParam): Promise<CreateUserRet> {
    const temporaryUserEntity = this.userFactory.creatTemporaryUser(userCreateDto);
    await this.userRepository.save(temporaryUserEntity);
    return { user: temporaryUserEntity };
  }

  async updateUser({ userUpdateDto }: UpdateUserParam): Promise<UpdateUserRet> {
    const userEntity = assert<IUser>(await this.userRepository.findOne({ where: { id: userUpdateDto.id } }));
    const updatedUserEntity = { ...userEntity, ...userUpdateDto };
    await this.userRepository.save(updatedUserEntity);
    return { user: updatedUserEntity };
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
    return { user: userEntity };
  }

  async createUserProfileImage({
    userProfileImageCreateDto,
  }: CreateUserProfileImageParam): Promise<CreateUserProfileImageRet> {
    const [userEntity, imageEntity] = await Promise.all([
      assert<IUser>(
        await this.userRepository
          .findOneOrFail({
            where: { id: userProfileImageCreateDto.userId },
            relations: ['profileImages', 'profileImages.image'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
          }),
      ),
      assert<IImage>(
        await this.imageRepository
          .findOneOrFail({ where: { id: userProfileImageCreateDto.imageId, path: 'user-profile' } })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Image not found');
          }),
      ),
    ]);
    const userProfileImageEntity = this.userFactory.createUserProfileImage(userProfileImageCreateDto, imageEntity);
    const user = new UserModel(userEntity);
    user.updateProfileImage(userProfileImageEntity);
    return { user: await this.userRepository.save(user.toEntity()) };
  }

  async deleteUserProfileImage({ userId }: DeleteProfileImage): Promise<void> {
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
    const user = new UserModel(userEntity);
    user.deleteProfileImage();
    await this.userRepository.save(user.toEntity());
  }
}
