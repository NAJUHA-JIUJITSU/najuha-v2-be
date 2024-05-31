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
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { BusinessException, CommonErrors, PostsErrors } from 'src/common/response/errorResponse';
import { IPost } from '../domain/interface/post.interface';
import { UserRepository } from 'src/database/custom-repository/user.repository';
import { PostRepository } from 'src/database/custom-repository/post.repository';
import { PostModel } from '../domain/model/post.model';
import { IPostLike } from '../domain/interface/post-like.interface';
import { PostLikeRepository } from 'src/database/custom-repository/post-like.repository';
import { PostReportRepository } from 'src/database/custom-repository/post-report.repository';

@Injectable()
export class PostsAppService {
  constructor(
    private readonly postFactory: PostFactory,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly postLikeRepository: PostLikeRepository,
    private readonly portReportRepository: PostReportRepository,
  ) {}

  async createPost({ postCreateDto }: CreatePostParam): Promise<CreatePostRet> {
    assert<IUser>(
      await this.userRepository.findOneOrFail({ where: { id: postCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
    );
    const newPost = new PostModel(this.postFactory.createPost(postCreateDto));
    return { post: await this.postRepository.save(newPost.toEntity()) };
  }

  /** Find posts. todo!!! */
  async findPosts({ page, limit }: FindPostsParam): Promise<FindPostsRet> {
    const posts = assert<IPost[]>(
      await this.postRepository.find({
        relations: ['likes', 'reports'],
        order: { createdAt: 'DESC' },
        skip: page * limit,
        take: limit,
      }),
    ).map((postEntity) => new PostModel(postEntity));
    let ret: FindPostsRet = { posts: posts.map((post) => post.toEntity()) };
    if (posts.length === limit) {
      ret = { ...ret, nextPage: page + 1 };
    }
    return ret;
  }

  async getPost({ postId }: GetPostParam): Promise<GetPostRet> {
    const postEntity = assert<IPost>(
      await this.postRepository
        .findOneOrFail({
          where: { id: postId },
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
    );
    return { post: postEntity };
  }

  async updatePost({ userId, postUpdateDto }: UpdatePostParam): Promise<UpdatePostRet> {
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository
          .findOneOrFail({
            where: { id: postUpdateDto.postId, userId },
            relations: ['postSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
          }),
      ),
    );
    const newPostSnapshot = this.postFactory.createPostSnapshot(postUpdateDto);
    post.addPostSnapshot(newPostSnapshot);
    return { post: await this.postRepository.save(post.toEntity()) };
  }

  async deletePost({ userId, postId }: DeletePostParam): Promise<void> {
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { userId, id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    post.delete();
    await this.postRepository.save(post.toEntity());
  }

  async createPostLike({ postLikeCreateDto }: CreatePostLikeParam): Promise<void> {
    Promise.all([
      await this.userRepository.findOneOrFail({ where: { id: postLikeCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      await this.postRepository.findOneOrFail({ where: { id: postLikeCreateDto.postId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      }),
    ]);
    const postLike = await this.postLikeRepository.findOne({
      where: { userId: postLikeCreateDto.userId, postId: postLikeCreateDto.postId },
    });
    if (postLike) throw new BusinessException(PostsErrors.POSTS_POST_LIKE_ALREADY_EXIST);
    const newPostLike = this.postFactory.createPostLike(postLikeCreateDto);
    this.postLikeRepository.save(newPostLike);
  }

  async deletePostLike({ userId, postId }: DeletePostLikeParam): Promise<void> {
    const postLike = assert<IPostLike>(
      await this.postLikeRepository.findOneOrFail({ where: { userId, postId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post like not found');
      }),
    );
    await this.postLikeRepository.delete(postLike);
  }

  async createPostReport({ postReportCreateDto }: CreatePostReportParam): Promise<void> {
    Promise.all([
      await this.userRepository.findOneOrFail({ where: { id: postReportCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      await this.postRepository.findOneOrFail({ where: { id: postReportCreateDto.postId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
      }),
    ]);
    const postReport = await this.portReportRepository.findOne({
      where: { userId: postReportCreateDto.userId, postId: postReportCreateDto.postId },
    });
    if (postReport) throw new BusinessException(PostsErrors.POSTS_POST_REPORT_ALREADY_EXIST);
    const ndwPostReport = this.postFactory.createPostReport(postReportCreateDto);
    await this.portReportRepository.save(ndwPostReport);
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
