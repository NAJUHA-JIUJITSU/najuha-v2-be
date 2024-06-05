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
    await this.userRepository.findOneOrFail({ where: { id: postCreateDto.userId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
    });
    const newPost = new PostModel(this.postFactory.createPost(postCreateDto));
    return { post: await this.postRepository.save(newPost.toEntity()) };
  }

  async findPosts(query: FindPostsParam): Promise<FindPostsRet> {
    const posts = assert<IPost[]>(await this.postRepository.findPosts(query)).map(
      (postEntity) => new PostModel(postEntity, query.userId),
    );
    let ret: FindPostsRet = { posts: posts.map((post) => post.toEntity()) };
    if (posts.length === query.limit) {
      ret = { ...ret, nextPage: query.page + 1 };
    }
    return ret;
  }

  async getPost({ userId, postId }: GetPostParam): Promise<GetPostRet> {
    const post = new PostModel(assert<IPost>(await this.postRepository.getPostById(postId, userId)), userId);
    return { post: post.toEntity() };
  }

  async updatePost({ userId, postUpdateDto }: UpdatePostParam): Promise<UpdatePostRet> {
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository
          .findOneOrFail({
            where: { id: postUpdateDto.postId, userId, status: 'ACTIVE' },
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
    this.postLikeRepository.save(newPostLike);
  }

  async deletePostLike({ userId, postId }: DeletePostLikeParam): Promise<void> {
    const postLikeEnitty = await this.postLikeRepository.findOneOrFail({ where: { userId, postId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post like not found');
    });
    await this.postLikeRepository.delete(postLikeEnitty);
  }

  async createPostReport({ postReportCreateDto }: CreatePostReportParam): Promise<void> {
    const [_, postEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: postReportCreateDto.userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.postRepository
        .findOneOrFail({ where: { id: postReportCreateDto.postId }, relations: ['postSnapshots', 'reports'] })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
    ]);
    const post = new PostModel(postEntity);
    post.addPostReport(this.postFactory.createPostReport(postReportCreateDto));
    await this.postRepository.save(post.toEntity());
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
