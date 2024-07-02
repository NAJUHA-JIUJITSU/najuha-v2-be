import { Injectable } from '@nestjs/common';
import { PostFactory } from '../domain/post.factory';
import {
  CreatePostParam,
  CreatePostRet,
  FindPostsParam,
  FindPostsRet,
  GetPostParam,
  GetPostRet,
  UpdatePostParam,
  UpdatePostRet,
  DeletePostParam,
  CreatePostLikeParam,
  DeletePostLikeParam,
  CreatePostReportParam,
  DeletePostReportParam,
} from './posts.app.dto';
import { assert } from 'typia';
import { BusinessException, CommonErrors, PostsErrors } from '../../../common/response/errorResponse';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { PostRepository } from '../../../database/custom-repository/post.repository';
import { PostModel } from '../domain/model/post.model';
import { IPostLike } from '../domain/interface/post-like.interface';
import { PostLikeRepository } from '../../../database/custom-repository/post-like.repository';
import { PostReportRepository } from '../../../database/custom-repository/post-report.repository';
import { ImageRepository } from '../../../database/custom-repository/image.repository';
import { DataSource, In } from 'typeorm';
import { UserEntity } from '../../../database/entity/user/user.entity';
import { PostEntity } from '../../../database/entity/post/post.entity';
import { PostReportEntity } from '../../../database/entity/post/post-report.entity';
import { PostSnapshotModel } from '../domain/model/post-snapshot.model';

@Injectable()
export class PostsAppService {
  constructor(
    private readonly postFactory: PostFactory,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly portReportRepository: PostReportRepository,
    private readonly imageRepository: ImageRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createPost({ postCreateDto }: CreatePostParam): Promise<CreatePostRet> {
    const [userEntity, imageEntities] = await Promise.all([
      this.userRepository
        .findOneOrFail({
          where: { id: postCreateDto.userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      (async () => {
        if (!postCreateDto.imageIds) return [];
        const imageEntities = await this.imageRepository.find({ where: { id: In(postCreateDto.imageIds) } });
        if (imageEntities.length !== postCreateDto.imageIds.length)
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Image not found');
        return imageEntities;
      })(),
    ]);
    const newPost = new PostModel(this.postFactory.createPost(postCreateDto, userEntity, imageEntities));
    return assert<CreatePostRet>({
      post: await this.postRepository.save(newPost.toData()),
    });
  }

  async findPosts(query: FindPostsParam): Promise<FindPostsRet> {
    const postModels = (await this.postRepository.findPosts(query)).map((postEntity) => new PostModel(postEntity));
    let ret = assert<FindPostsRet>({ posts: postModels.map((post) => post.toData()) });
    if (ret.posts.length === query.limit) ret.nextPage = query.page + 1;
    return ret;
  }

  async getPost({ userId, postId }: GetPostParam): Promise<GetPostRet> {
    const post = new PostModel(await this.postRepository.getPostById(postId, userId));
    return assert<GetPostRet>({ post: post.toData() });
  }

  async updatePost({ postUpdateDto }: UpdatePostParam): Promise<UpdatePostRet> {
    const [_user, postEntity, imageEntities] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: postUpdateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.postRepository.getPostById(postUpdateDto.postId, postUpdateDto.userId),
      (async () => {
        if (!postUpdateDto.imageIds) return [];
        const imageEntities = await this.imageRepository.find({ where: { id: In(postUpdateDto.imageIds) } });
        if (imageEntities.length !== postUpdateDto.imageIds.length)
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Image not found');
        return imageEntities;
      })(),
    ]);
    const post = new PostModel(postEntity);
    const newPostSnapshot = new PostSnapshotModel(this.postFactory.createPostSnapshot(postUpdateDto, imageEntities));
    post.addPostSnapshot(newPostSnapshot);
    return assert<UpdatePostRet>({ post: await this.postRepository.save(post.toData()) });
  }

  async deletePost({ userId, postId }: DeletePostParam): Promise<void> {
    const postEntity = await this.postRepository
      .findOneOrFail({ where: { userId, id: postId, status: 'ACTIVE' } })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      });
    await this.postRepository.softDelete(postEntity.id);
  }

  async createPostLike({ postLikeCreateDto }: CreatePostLikeParam): Promise<void> {
    await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: postLikeCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.postRepository.findOneOrFail({ where: { id: postLikeCreateDto.postId, status: 'ACTIVE' } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      }),
    ]);
    const postLike = await this.postLikeRepository.findOne({
      where: { userId: postLikeCreateDto.userId, postId: postLikeCreateDto.postId },
    });
    if (postLike) throw new BusinessException(PostsErrors.POSTS_POST_LIKE_ALREADY_EXIST);
    const newPostLike = this.postFactory.createPostLike(postLikeCreateDto);
    await this.postLikeRepository.save(newPostLike);
  }

  async deletePostLike({ userId, postId }: DeletePostLikeParam): Promise<void> {
    const postLikeEnitty = await this.postLikeRepository.findOneOrFail({ where: { userId, postId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post like not found');
    });
    await this.postLikeRepository.delete(postLikeEnitty);
  }

  async createPostReport({ postReportCreateDto }: CreatePostReportParam): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [_user, postEntity, postReportEntities] = await Promise.all([
        queryRunner.manager.findOneOrFail(UserEntity, { where: { id: postReportCreateDto.userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
        queryRunner.manager
          .findOneOrFail(PostEntity, {
            where: { id: postReportCreateDto.postId },
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
          }),
        queryRunner.manager.find(PostReportEntity, {
          where: { postId: postReportCreateDto.postId },
        }),
      ]);
      const alreadyExistPostReport = postReportEntities.find((report) => report.userId === postReportCreateDto.userId);
      if (alreadyExistPostReport) throw new BusinessException(PostsErrors.POSTS_POST_REPORT_ALREADY_EXIST);
      await queryRunner.manager.save(PostReportEntity, this.postFactory.createPostReport(postReportCreateDto));
      const acceptedReports = postReportEntities.filter((report) => report.status === 'ACCEPTED');
      if (acceptedReports.length >= 9)
        await queryRunner.manager.update(PostEntity, postEntity.id, { status: 'INACTIVE' });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deletePostReport({ userId, postId }: DeletePostReportParam): Promise<void> {
    const postReportEntity = assert<IPostLike>(
      await this.portReportRepository.findOneOrFail({ where: { userId, postId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post report not found');
      }),
    );
    await this.portReportRepository.delete(postReportEntity);
  }
}
