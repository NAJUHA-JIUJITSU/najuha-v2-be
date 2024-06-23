import { Injectable } from '@nestjs/common';
import { IPostLike, IPostLikeCreateDto } from './interface/post-like.interface';
import { IPostReportCreateDto } from './interface/post-report.interface';
import { PostModel } from './model/post.model';
import { PostSnapshotModel } from './model/post-snapshot.model';
import { PostSnapshotImageModel } from './model/post-snapshot-image.model';
import { PostLikeModel } from './model/post-like.model';
import { PostReportModel } from './model/post-report.model';
import { CreatePostParam, UpdatePostParam } from '../application/posts.app.dto';
import { IImageModelData } from '../../images/domain/interface/image.interface';
import { ImageModel } from '../../images/domain/model/image.model';
import { IUserModelData } from '../../users/domain/interface/user.interface';
import { UserModel } from '../../users/domain/model/user.model';

@Injectable()
export class PostFactory {
  createPost(
    { userId, category, title, body }: CreatePostParam,
    user: IUserModelData,
    images?: IImageModelData[],
  ): PostModel {
    const postModel = PostModel.create({ userId, category });
    const postSnapshotModel = PostSnapshotModel.create({ postId: postModel.id, title, body });
    const postSnapshotImageModels =
      images?.map((image, index) => {
        const postSnapshotImage = PostSnapshotImageModel.create({
          postSnapshotId: postSnapshotModel.id,
          imageId: image.id,
          sequence: index,
        });
        const imageModel = new ImageModel(image);
        postSnapshotImage.setImage(imageModel);
        return postSnapshotImage;
      }) || [];
    const userModels = new UserModel(user);
    postSnapshotModel.addPostSnapshotImages(postSnapshotImageModels);
    postModel.addPostSnapshot(postSnapshotModel);
    postModel.setUser(userModels);
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
