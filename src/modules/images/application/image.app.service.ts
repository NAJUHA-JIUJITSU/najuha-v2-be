import { Injectable } from '@nestjs/common';
import { BucketService } from '../../../infrastructure/bucket/bucket.service';
import { ImageRepository } from '../../../database/custom-repository/image.repository';
import { uuidv7 } from 'uuidv7';
import { CreateImageParam, CreateImageRet } from './image.app.dto';
import appEnv from '../../../common/app-env';
import { IImage } from '../domain/interface/image.interface';

@Injectable()
export class ImageAppService {
  constructor(
    private readonly bucketService: BucketService,
    private readonly imageRepository: ImageRepository,
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
}
