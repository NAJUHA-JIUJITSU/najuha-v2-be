import { Injectable } from '@nestjs/common';
import { BucketService } from '../../../infrastructure/bucket/bucket.service';
import { ImageRepository } from '../../../database/custom-repository/image.repository';
import { uuidv7 } from 'uuidv7';
import {
  CreateImageParam,
  CreateImageRet,
  DeleteUserProfileImageParam,
  CreateUserProfileImagePresignedPostParam,
  CreateUserProfileImagePresignedPostRet,
} from './image.app.dto';
import appEnv from '../../../common/app-env';
import { IImage } from '../domain/interface/image.interface';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { BusinessException, CommonErrors } from '../../../common/response/errorResponse';

@Injectable()
export class ImageAppService {
  constructor(
    private readonly bucketService: BucketService,
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createImage({ imageCreateDto }: CreateImageParam): Promise<CreateImageRet> {
    const imageEntity: IImage = {
      id: uuidv7(),
      path: imageCreateDto.path,
      format: imageCreateDto.format,
      userId: imageCreateDto.userId,
      createdAt: new Date(),
      linkedAt: null,
    };

    const presignedPost = await this.bucketService.getPresignedPostUrl({
      key: imageEntity.id,
      path: imageEntity.path,
      format: imageEntity.format,
      expiresIn: appEnv.bucketPresignedImageUrlExpirationTime,
      maxSize: appEnv.bucketPresignedImageMaxSize,
    });

    return {
      image: await this.imageRepository.save(imageEntity),
      presignedPost,
    };
  }

  async createUserProfileImagePresignedPost({
    userId,
    format,
  }: CreateUserProfileImagePresignedPostParam): Promise<CreateUserProfileImagePresignedPostRet> {
    const user = await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
    });
    const presignedPost = await this.bucketService.getPresignedPostUrl({
      key: user.id,
      path: 'user-profile',
      format,
      expiresIn: appEnv.bucketPresignedImageUrlExpirationTime,
      maxSize: appEnv.bucketPresignedImageMaxSize,
    });
    return { presignedPost };
  }

  async deleteUserProfileImage({ userId }: DeleteUserProfileImageParam): Promise<void> {
    await this.bucketService.deleteObject(`user-profile/${userId}`);
  }
}
