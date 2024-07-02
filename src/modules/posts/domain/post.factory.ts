import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { IPostCreateDto, IPostModelData } from './interface/post.interface';
import { IPostSnapshotCreateDto, IPostSnapshotModelData } from './interface/post-snapshot.interface';
import { IPostLikeCreateDto, IPostLikeModelData } from './interface/post-like.interface';
import { IPostReportCreateDto, IPostReportModelData } from './interface/post-report.interface';
import { IImageModelData } from '../../images/domain/interface/image.interface';
import { IPostSnapshotImageCreateDto, IPostSnapshotImageModleData } from './interface/post-snapshot-image.interface';
import { IUserModelData } from '../../users/domain/interface/user.interface';

@Injectable()
export class PostFactory {
  createPost(
    { userId, category, title, body }: IPostCreateDto,
    user: IUserModelData,
    images?: IImageModelData[],
  ): IPostModelData {
    const postId = uuidv7();
    const postSnapshot = this.createPostSnapshot({ postId, title, body }, images);
    return {
      id: postId,
      userId,
      viewCount: 0,
      status: 'ACTIVE',
      category,
      createdAt: new Date(),
      deletedAt: null,
      postSnapshots: [postSnapshot],
      user,
    };
  }

  createPostSnapshot(
    { postId, title, body }: IPostSnapshotCreateDto,
    images?: IImageModelData[],
  ): IPostSnapshotModelData {
    const postSnapshotId = uuidv7();
    const postSnapshotImages =
      images?.map((image, index) =>
        this.createPostSnapshotImage({ postSnapshotId, imageId: image.id, sequence: index }, image),
      ) || [];
    return {
      id: postSnapshotId,
      postId,
      title,
      body,
      createdAt: new Date(),
      postSnapshotImages: postSnapshotImages,
    };
  }

  createPostSnapshotImage(
    { postSnapshotId, imageId, sequence }: IPostSnapshotImageCreateDto,
    image: IImageModelData,
  ): IPostSnapshotImageModleData {
    return {
      id: uuidv7(),
      postSnapshotId,
      imageId,
      sequence,
      createdAt: new Date(),
      image: {
        ...image,
        linkedAt: new Date(),
      },
    };
  }

  createPostLike({ userId, postId }: IPostLikeCreateDto): IPostLikeModelData {
    return {
      id: uuidv7(),
      userId,
      postId,
      createdAt: new Date(),
    };
  }

  createPostReport({ type, userId, postId }: IPostReportCreateDto): IPostReportModelData {
    return {
      id: uuidv7(),
      type,
      status: 'ACCEPTED',
      userId,
      postId,
      createdAt: new Date(),
    };
  }
}
