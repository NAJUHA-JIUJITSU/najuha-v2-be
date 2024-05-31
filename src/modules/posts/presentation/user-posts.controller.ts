import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { IPost } from '../domain/interface/post.interface';
import { PostsAppService } from '../application/posts.app.service';
import {
  CreatePostReqBody,
  CreatePostRes,
  FindPostsQuery,
  FindPostsRes,
  GetPostRes,
  UpdatePostReqBody,
  UpdatePostRes,
} from './dtos';

@Controller('user/posts')
export class UserPostsController {
  constructor(private readonly postsAppService: PostsAppService) {}

  /**
   * u-7-1 createPost.
   * - RoleLevel: USER.
   *
   * 새로운 게시글을 작성합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async createPost(@Req() req: Request, @TypedBody() body: CreatePostReqBody): Promise<ResponseForm<CreatePostRes>> {
    return createResponseForm(await this.postsAppService.createPost({ userId: req['userId'], ...body }));
  }

  /**
   * u-7-2 findPosts.
   * - RoleLevel: USER.
   *
   * 여러 게시글을 조회합니다.
   * 필터링, 정렬, 페이지네이션 등의 기능을 제공합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/')
  async findPosts(@Req() req: Request, @TypedQuery() query: FindPostsQuery): Promise<ResponseForm<FindPostsRes>> {
    return createResponseForm(
      await this.postsAppService.findPosts({
        page: query.page ?? 0,
        limit: query.limit ?? 10,
        userId: req['userId'],
      }),
    );
  }

  /**
   * u-7-3 getPost.
   * - RoleLevel: USER.
   *
   * 특정 게시글을 조회합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:postId')
  async getPost(@TypedParam('postId') postId: IPost['id'], @Req() req: Request): Promise<ResponseForm<GetPostRes>> {
    return createResponseForm(await this.postsAppService.getPost({ userId: req['userId'], postId }));
  }

  /**
   * u-7-4 updatePost.
   * - RoleLevel: USER.
   *
   * 기존 게시글을 수정합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/:postId')
  async updatePost(
    @Req() req: Request,
    @TypedParam('postId') postId: IPost['id'],
    @TypedBody() body: UpdatePostReqBody,
  ): Promise<ResponseForm<UpdatePostRes>> {
    return createResponseForm(
      await this.postsAppService.updatePost({
        userId: req['userId'],
        postId,
        ...body,
      }),
    );
  }

  /**
   * u-7-5 deletePost.
   * - RoleLevel: USER.
   *
   * 특정 게시글을 삭제합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId')
  async deletePost(@TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deletePost({ postId }));
  }

  /**
   * u-7-6 createPostLike.
   * - RoleLevel: USER.
   *
   * 게시글에 좋아요를 추가합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/like')
  async createPostLike(@TypedParam('postId') postId: IPost['id'], @Req() req: Request): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.createPostLike({ userId: req['userId'], postId }));
  }

  /**
   * u-7-7 deletePostLike.
   * - RoleLevel: USER.
   *
   * 게시글에 대한 좋아요를 취소합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId/like')
  async deletePostLike(@TypedParam('postId') postId: IPost['id'], @Req() req: Request): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deletePostLike({ userId: req['userId'], postId }));
  }

  /**
   * u-7-8 createPostReport.
   * - RoleLevel: USER.
   *
   * 게시글을 신고합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/report')
  async createPostReport(@TypedParam('postId') postId: IPost['id'], @Req() req: Request): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.createPostReport({ userId: req['userId'], postId }));
  }

  /**
   * u-7-9 deletePostReport.
   * - RoleLevel: USER.
   *
   * 게시글 신고를 취소합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId/report')
  async deletePostReport(@TypedParam('postId') postId: IPost['id'], @Req() req: Request): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deletePostReport({ userId: req['userId'], postId }));
  }

  /**
   * u-7-10 createComment.
   * - RoleLevel: USER.
   *
   * 게시글에 댓글을 추가합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/comment')
  async createComment(
    @TypedParam('postId') postId: IPost['id'],
    @Req() req: Request,
    @TypedBody() body: CreatePostReqBody,
  ): Promise<ResponseForm<CreatePostRes>> {
    return createResponseForm(await this.postsAppService.createComment({ userId: req['userId'], postId, ...body }));
  }

  /**
   * u-7-11 createCommentReply.
   * - RoleLevel: USER.
   *
   * 댓글에 대한 답글을 추가합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/comment/:commentId/reply')
  async createPostCommentReply(
    @TypedParam('commentId') commentId: IPost['id'],
    @Req() req: Request,
    @TypedBody() body: CreatePostReqBody,
  ): Promise<ResponseForm<CreatePostRes>> {
    return createResponseForm(
      await this.postsAppService.createCommentReply({ userId: req['userId'], commentId, ...body }),
    );
  }

  /**
   * u-7-12 updateComment.
   * - RoleLevel: USER.
   *
   * 기존 댓글을 수정합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/comment/:commentId')
  async updatePostComment(
    @TypedParam('commentId') commentId: IPost['id'],
    @Req() req: Request,
    @TypedBody() body: UpdatePostReqBody,
  ): Promise<ResponseForm<UpdatePostRes>> {
    return createResponseForm(await this.postsAppService.updateComment({ userId: req['userId'], commentId, ...body }));
  }

  /**
   * u-7-13 deleteComment.
   * - RoleLevel: USER.
   *
   * 특정 댓글을 삭제합니다.
   *
   * @tag u-7 posts
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId')
  async deletePostComment(@TypedParam('commentId') commentId: IPost['id']): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deleteComment({ commentId }));
  }

  /**
   * u-7-14 createCommentLike.
   * - RoleLevel: USER.
   *
   * 댓글에 좋아요를 추가합니다.
   *
   * @tag u-7 posts
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/comment/:commentId/like')
  async createPostCommentLike(
    @TypedParam('commentId') commentId: IPost['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.createCommentLike({ userId: req['userId'], commentId }));
  }

  /**
   * u-7-15 deleteCommentLike.
   * - RoleLevel: USER.
   *
   * 댓글에 대한 좋아요를 취소합니다.
   *
   * @tag u-7 posts
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId/like')
  async deletePostCommentLike(
    @TypedParam('commentId') commentId: IPost['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deleteCommentLike({ userId: req['userId'], commentId }));
  }

  /**
   * u-7-16 createCommentReport.
   * - RoleLevel: USER.
   *
   * 댓글을 신고합니다.
   *
   * @tag u-7 posts
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/comment/:commentId/report')
  async createPostCommentReport(
    @TypedParam('commentId') commentId: IPost['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.createCommentReport({ userId: req['userId'], commentId }));
  }

  /**
   * u-7-17 deleteCommentReport.
   * - RoleLevel: USER.
   *
   * 댓글 신고를 취소합니다.
   *
   * @tag u-7 posts
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId/report')
  async deletePostCommentReport(
    @TypedParam('commentId') commentId: IPost['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deleteCommentReport({ userId: req['userId'], commentId }));
  }
}
