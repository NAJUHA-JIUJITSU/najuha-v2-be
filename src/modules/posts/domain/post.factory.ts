import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { IPost, IPostCreateDto, IPostUpdateDto } from './interface/post.interface';
import { IPostSnapshot, IPostSnapshotCreateDto } from './interface/post-snapshot.interface';
import { IPostLike, IPostLikeCreateDto } from './interface/post-like.interface';
import { IPostReport, IPostReportCreateDto } from './interface/post-report.interface';
import { IImage } from 'src/modules/images/domain/interface/image.interface';
import { IPostSnapshotImage, IPostSnapshotImageCreateDto } from './interface/post-snapshot-image.interface';

@Injectable()
export class PostFactory {
  createPost({ userId, category, title, body }: IPostCreateDto, images?: IImage[]): IPost {
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
    };
  }

  createPostSnapshot({ postId, title, body }: IPostSnapshotCreateDto, images?: IImage[]): IPostSnapshot {
    const postSnapshotId = uuidv7();
    const postSnapshotImages =
      images?.map((image) => this.createPostSnapshotImage({ postSnapshotId, imageId: image.id, image })) || [];
    return {
      id: postSnapshotId,
      postId,
      title,
      body,
      createdAt: new Date(),
      postSnapshotImages: postSnapshotImages,
    };
  }

  createPostSnapshotImage({ postSnapshotId, imageId, image }: IPostSnapshotImageCreateDto): IPostSnapshotImage {
    return {
      id: uuidv7(),
      postSnapshotId,
      imageId,
      createdAt: new Date(),
      image,
    };
  }

  createPostLike({ userId, postId }: IPostLikeCreateDto): IPostLike {
    return {
      id: uuidv7(),
      userId,
      postId,
      createdAt: new Date(),
    };
  }

  createPostReport({ type, reason, userId, postId }: IPostReportCreateDto): IPostReport {
    return {
      id: uuidv7(),
      type,
      status: 'ACCEPTED',
      reason,
      userId,
      postId,
      createdAt: new Date(),
    };
  }
}
