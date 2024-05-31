import { Injectable } from '@nestjs/common';
import { PostFactory } from '../domain/post.factory';
import { CommentFactory } from '../domain/comment.factory';
import {
  CreatePostParam,
  CreatePostRet,
  FindPostsParam,
  FindPostsRet,
  GetPostParam,
  GetPostRet,
  UpdatePostParam,
  UpdatePostRet,
  CreateCommentParam,
  CreateCommentRet,
  CreateReplyParam,
  CreateReplyRet,
  FindCommentsParam,
  FindCommentsRet,
  GetCommentParam,
  GetCommentRet,
  UpdateCommentParam,
  UpdateCommentRet,
} from './dtos';
import { assert } from 'typia';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { IPost } from '../domain/interface/post.interface';
import { IComment } from '../domain/interface/comment.interface';
import { UserModel } from 'src/modules/users/domain/model/user.model';
import { UserRepository } from 'src/database/custom-repository/user.repository';
import { PostRepository } from 'src/database/custom-repository/post.repository';
import { CommentRepository } from 'src/database/custom-repository/comment.repository';
import { PostModel } from '../domain/model/post.model';
import { CommentModel } from '../domain/model/comment.model';

@Injectable()
export class PostsAppService {
  constructor(
    private readonly postFactory: PostFactory,
    private readonly commentFactory: CommentFactory,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  /** Create post. */
  async createPost({ userId, title, body }: CreatePostParam): Promise<CreatePostRet> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const newPost = new PostModel(this.postFactory.createPost(user, title, body));
    return { post: await this.postRepository.save(newPost.toEntity()) };
  }

  /** Get post. */
  async getPost({ userId, postId }: GetPostParam): Promise<GetPostRet> {
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository
          .findOneOrFail({
            where: { id: postId, userId },
            relations: ['user'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
          }),
      ),
    );
    return { post: post.toEntity() };
  }

  /** Update post. */
  async updatePost({ userId, postId, title, body }: UpdatePostParam): Promise<UpdatePostRet> {
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository
          .findOneOrFail({
            where: { id: postId, userId },
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
          }),
      ),
    );
    post.updateDetails(title, body);
    return { post: await this.postRepository.save(post.toEntity()) };
  }

  /** Delete post. */
  async deletePost({ postId }: { postId: IPost['id'] }): Promise<void> {
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    await this.postRepository.delete(post.toEntity());
  }

  /** Create post like. */
  async createPostLike({ userId, postId }: { userId: IUser['id']; postId: IPost['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    post.addLike(user);
    await this.postRepository.save(post.toEntity());
  }

  /** Delete post like. */
  async deletePostLike({ userId, postId }: { userId: IUser['id']; postId: IPost['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    post.removeLike(user);
    await this.postRepository.save(post.toEntity());
  }

  /** Create post report. */
  async createPostReport({ userId, postId }: { userId: IUser['id']; postId: IPost['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    post.addReport(user);
    await this.postRepository.save(post.toEntity());
  }

  /** Delete post report. */
  async deletePostReport({ userId, postId }: { userId: IUser['id']; postId: IPost['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    post.removeReport(user);
    await this.postRepository.save(post.toEntity());
  }

  /** Find posts. */
  async findPosts({ userId, page, limit }: FindPostsParam): Promise<FindPostsRet> {
    const posts = assert<IPost[]>(
      await this.postRepository.find({
        where: { userId },
        relations: ['user', 'likes', 'reports'],
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

  /** Create comment. */
  async createComment({ userId, postId, body }: CreateCommentParam): Promise<CreateCommentRet> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const post = new PostModel(
      assert<IPost>(
        await this.postRepository.findOneOrFail({ where: { id: postId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
        }),
      ),
    );
    const newComment = new CommentModel(this.commentFactory.createComment(user, post, body));
    return { comment: await this.commentRepository.save(newComment.toEntity()) };
  }

  /** Create reply. */
  async createCommentReply({ userId, commentId, body }: CreateReplyParam): Promise<CreateReplyRet> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const parentComment = new CommentModel(
      assert<IComment>(
        await this.commentRepository.findOneOrFail({ where: { id: commentId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
      ),
    );
    const newComment = new CommentModel(this.commentFactory.createReply(user, parentComment, body));
    return { comment: await this.commentRepository.save(newComment.toEntity()) };
  }

  /** Get comment. */
  async getComment({ userId, commentId }: GetCommentParam): Promise<GetCommentRet> {
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository
          .findOneOrFail({
            where: { id: commentId, userId },
            relations: ['user', 'post'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          }),
      ),
    );
    return { comment: comment.toEntity() };
  }

  /** Update comment. */
  async updateComment({ userId, commentId, body }: UpdateCommentParam): Promise<UpdateCommentRet> {
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository
          .findOneOrFail({
            where: { id: commentId, userId },
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
          }),
      ),
    );
    comment.updateBody(body);
    return { comment: await this.commentRepository.save(comment.toEntity()) };
  }

  /** Delete comment. */
  async deleteComment({ commentId }: { commentId: IComment['id'] }): Promise<void> {
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository.findOneOrFail({ where: { id: commentId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
      ),
    );
    await this.commentRepository.delete(comment.toEntity());
  }

  /** Create comment like. */
  async createCommentLike({ userId, commentId }: { userId: IUser['id']; commentId: IComment['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository.findOneOrFail({ where: { id: commentId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
      ),
    );
    comment.addLike(user);
    await this.commentRepository.save(comment.toEntity());
  }

  /** Delete comment like. */
  async deleteCommentLike({ userId, commentId }: { userId: IUser['id']; commentId: IComment['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository.findOneOrFail({ where: { id: commentId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
      ),
    );
    comment.removeLike(user);
    await this.commentRepository.save(comment.toEntity());
  }

  /** Create comment report. */
  async createCommentReport({ userId, commentId }: { userId: IUser['id']; commentId: IComment['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository.findOneOrFail({ where: { id: commentId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
      ),
    );
    comment.addReport(user);
    await this.commentRepository.save(comment.toEntity());
  }

  /** Delete comment report. */
  async deleteCommentReport({ userId, commentId }: { userId: IUser['id']; commentId: IComment['id'] }): Promise<void> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const comment = new CommentModel(
      assert<IComment>(
        await this.commentRepository.findOneOrFail({ where: { id: commentId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Comment not found');
        }),
      ),
    );
    comment.removeReport(user);
    await this.commentRepository.save(comment.toEntity());
  }

  /** Find comments. */
  async findComments({ userId, postId, page, limit }: FindCommentsParam): Promise<FindCommentsRet> {
    const comments = assert<IComment[]>(
      await this.commentRepository.find({
        where: { userId, postId },
        relations: ['user', 'post', 'likes', 'reports'],
        order: { createdAt: 'DESC' },
        skip: page * limit,
        take: limit,
      }),
    ).map((commentEntity) => new CommentModel(commentEntity));
    let ret: FindCommentsRet = { comments: comments.map((comment) => comment.toEntity()) };
    if (comments.length === limit) {
      ret = { ...ret, nextPage: page + 1 };
    }
    return ret;
  }
}
