// import { Injectable } from '@nestjs/common';
// import { uuidv7 } from 'uuidv7';
// import { IPost, IPostCreateDtoParm } from './interface/post.interface';
// import { IPostSnapshot, IPostSnapshotCreateDto } from './interface/post-snapshot.interface';
// import { IPostLike, IPostLikeCreateDto } from './interface/post-like.interface';
// import { IPostReport, IPostReportCreateDto } from './interface/post-report.interface';
// import { IImage } from '../../images/domain/interface/image.interface';
// import { IPostSnapshotImage, IPostSnapshotImageCreateDto } from './interface/post-snapshot-image.interface';
// import { IPostModelData } from './model/post.model';

// @Injectable()
// export class PostFactory {
//   createPost({ userId, category, title, body }: IPostCreateDtoParm, images?: IImage[]): IPostModelData {
//     const postId = uuidv7();
//     const postSnapshot = this.createPostSnapshot({ postId, title, body }, images);
//     return {
//       id: postId,
//       userId,
//       viewCount: 0,
//       status: 'ACTIVE',
//       category,
//       createdAt: new Date(),
//       deletedAt: null,
//       postSnapshots: [postSnapshot],
//     };
//   }

//   createPostSnapshot({ postId, title, body }: IPostSnapshotCreateDto, images?: IImage[]): IPostSnapshot {
//     const postSnapshotId = uuidv7();
//     // const postSnapshotImages =
//     //   images?.map((image) => this.createPostSnapshotImage({ postSnapshotId, imageId: image.id, image })) || [];
//     const postSnapshotImages =
//       images?.map((image, index) =>
//         this.createPostSnapshotImage({ postSnapshotId, imageId: image.id, image }, index),
//       ) || [];
//     return {
//       id: postSnapshotId,
//       postId,
//       title,
//       body,
//       createdAt: new Date(),
//       postSnapshotImages: postSnapshotImages,
//     };
//   }

//   createPostSnapshotImage(
//     { postSnapshotId, imageId, image }: IPostSnapshotImageCreateDto,
//     sequence: number = 0,
//   ): IPostSnapshotImage {
//     return {
//       id: uuidv7(),
//       postSnapshotId,
//       imageId,
//       createdAt: new Date(),
//       sequence,
//       image,
//     };
//   }

//   createPostLike({ userId, postId }: IPostLikeCreateDto): IPostLike {
//     return {
//       id: uuidv7(),
//       userId,
//       postId,
//       createdAt: new Date(),
//     };
//   }

//   createPostReport({ type, reason, userId, postId }: IPostReportCreateDto): IPostReport {
//     return {
//       id: uuidv7(),
//       type,
//       status: 'ACCEPTED',
//       reason,
//       userId,
//       postId,
//       createdAt: new Date(),
//     };
//   }
// }

import { Injectable } from '@nestjs/common';
import { IPostLike, IPostLikeCreateDto } from './interface/post-like.interface';
import { IPostReportCreateDto } from './interface/post-report.interface';
import { PostModel } from './model/post.model';
import { PostSnapshotModel } from './model/post-snapshot.model';
import { PostSnapshotImageModel } from './model/post-snapshot-image.model';
import { PostLikeModel } from './model/post-like.model';
import { PostReportModel } from './model/post-report.model';
import { CreatePostParam, UpdatePostParam } from '../application/posts.app.dto';

@Injectable()
export class PostFactory {
  createPost({ userId, category, title, body, imageIds }: CreatePostParam): PostModel {
    const postModel = PostModel.create({ userId, category });
    const postSnapshotModel = PostSnapshotModel.create({ postId: postModel.id, title, body });
    const postSnapshotImageModels =
      imageIds?.map((imageId, index) => {
        return PostSnapshotImageModel.create({
          postSnapshotId: postSnapshotModel.id,
          imageId: imageId,
          sequence: index,
        });
      }) || [];
    postSnapshotModel.addPostSnapshotImages(postSnapshotImageModels);
    postModel.addPostSnapshot(postSnapshotModel);
    return postModel;
  }

  createPostSnapshot({ postId, title, body, imageIds }: UpdatePostParam): PostSnapshotModel {
    const postSnapshotModel = PostSnapshotModel.create({ postId, title, body });
    const postSnapshotImageModels =
      imageIds?.map((imageId, index) =>
        PostSnapshotImageModel.create({ postSnapshotId: postSnapshotModel.id, imageId, sequence: index }),
      ) || [];
    postSnapshotModel.addPostSnapshotImages(postSnapshotImageModels);
    return postSnapshotModel;
  }

  createPostLike({ userId, postId }: IPostLikeCreateDto): IPostLike {
    return PostLikeModel.create({ userId, postId });
  }

  createPostReport({ type, reason, userId, postId }: IPostReportCreateDto): PostReportModel {
    return PostReportModel.create({ type, reason, userId, postId });
  }
}
