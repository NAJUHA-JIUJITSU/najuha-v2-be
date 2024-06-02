import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { IPost } from '../domain/interface/post.interface';
import { PostsAppService } from '../application/posts.app.service';
import {
  CreateCommentReplyReqBody,
  CreateCommentReplyRes,
  CreateCommentReportReqBody,
  CreateCommentReqBody,
  CreateCommentRes,
  CreatePostReportReqBody,
  CreatePostReqBody,
  CreatePostRes,
  FindCommentRepliesReqQuery,
  FindCommentsReqQuery,
  FindCommentsRes,
  FindPostsReqQuery,
  FindPostsRes,
  GetPostRes,
  UpdateCommentReqBody,
  UpdateCommentRes,
  UpdatePostReqBody,
  UpdatePostRes,
} from './posts.presentation.dto';
import { IComment } from '../domain/interface/comment.interface';
import { CommentsAppService } from '../application/comments.app.service';

@Controller('user/posts')
export class UserPostsController {
  constructor(
    private readonly postsAppService: PostsAppService,
    private readonly commentsAppService: CommentsAppService,
  ) {}

  // ------------------------------------------------------------
  // Post API
  // ------------------------------------------------------------
  /**
   * u-7-1 createPost.
   * - RoleLevel: USER.
   *
   * 새로운 게시글을 작성합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async createPost(@Req() req: Request, @TypedBody() body: CreatePostReqBody): Promise<ResponseForm<CreatePostRes>> {
    return createResponseForm(
      await this.postsAppService.createPost({ postCreateDto: { userId: req['userId'], ...body } }),
    );
  }

  /**
   * u-7-2 findPosts.
   * - RoleLevel: USER.
   *
   * 여러 게시글을 조회합니다.
   * 필터링, 정렬, 페이지네이션 등의 기능을 제공합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/')
  async findPosts(@Req() req: Request, @TypedQuery() query: FindPostsReqQuery): Promise<ResponseForm<FindPostsRes>> {
    return createResponseForm(
      await this.postsAppService.findPosts({
        userId: req['userId'],
        page: query.page || 0,
        limit: query.limit || 10,
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
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:postId')
  async getPost(@Req() req: Request, @TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<GetPostRes>> {
    return createResponseForm(
      await this.postsAppService.getPost({
        userId: req['userId'],
        postId,
      }),
    );
  }

  /**
   * u-7-4 updatePost.
   * - RoleLevel: USER.
   *
   * 기존 게시글을 수정합니다.
   *
   * @tag u-7 posts
   * @security bearer
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
        postUpdateDto: {
          postId,
          ...body,
        },
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
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId')
  async deletePost(@Req() req: Request, @TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deletePost({ userId: req['userId'], postId }));
  }

  /**
   * u-7-6 createPostLike.
   * - RoleLevel: USER.
   *
   * 게시글에 좋아요를 추가합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/like')
  async createPostLike(@TypedParam('postId') postId: IPost['id'], @Req() req: Request): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.postsAppService.createPostLike({
        postLikeCreateDto: { userId: req['userId'], postId },
      }),
    );
  }

  /**
   * u-7-7 deletePostLike.
   * - RoleLevel: USER.
   *
   * 게시글에 대한 좋아요를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId/like')
  async deletePostLike(@Req() req: Request, @TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.postsAppService.deletePostLike({
        userId: req['userId'],
        postId,
      }),
    );
  }

  /**
   * u-7-8 createPostReport.
   * - RoleLevel: USER.
   *
   * 게시글을 신고합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/report')
  async createPostReport(
    @Req() req: Request,
    @TypedParam('postId') postId: IPost['id'],
    @TypedBody() body: CreatePostReportReqBody,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.postsAppService.createPostReport({
        postReportCreateDto: { userId: req['userId'], postId, ...body },
      }),
    );
  }

  /**
   * u-7-9 deletePostReport.
   * - RoleLevel: USER.
   *
   * 게시글 신고를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId/report')
  async deletePostReport(@Req() req: Request, @TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.postsAppService.deletePostReport({
        userId: req['userId'],
        postId,
      }),
    );
  }

  // ------------------------------------------------------------
  // Comment API
  // ------------------------------------------------------------
  /**
   * u-7-10 createComment.
   * - RoleLevel: USER.
   *
   * 게시글에 댓글을 추가합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/comment')
  async createComment(
    @TypedParam('postId') postId: IPost['id'],
    @Req() req: Request,
    @TypedBody() body: CreateCommentReqBody,
  ): Promise<ResponseForm<CreateCommentRes>> {
    return createResponseForm(
      await this.commentsAppService.createComment({
        commentCreateDto: { userId: req['userId'], postId, ...body },
      }),
    );
  }

  /**
   * u-7-11 createCommentReply.
   * - RoleLevel: USER.
   *
   * 댓글에 대한 답글을 추가합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/:postId/comment/:commentId/reply')
  async createCommentReply(
    @TypedParam('postId') postId: IPost['id'],
    @TypedParam('commentId') commentId: IComment['id'],
    @Req() req: Request,
    @TypedBody() body: CreateCommentReplyReqBody,
  ): Promise<ResponseForm<CreateCommentReplyRes>> {
    return createResponseForm(
      await this.commentsAppService.createCommentReply({
        commentReplyCreateDto: {
          userId: req['userId'],
          postId,
          parentId: commentId,
          ...body,
        },
      }),
    );
  }

  /**
   * u-7-12 findComments.
   * - RoleLevel: USER.
   *
   * 게시글의 댓글을 조회합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:postId/comment')
  async findComments(
    @Req() req: Request,
    @TypedParam('postId') postId: IPost['id'],
    @TypedQuery() query: FindCommentsReqQuery,
  ): Promise<ResponseForm<FindCommentsRes>> {
    return createResponseForm(
      await this.commentsAppService.findComments({
        postId,
        userId: req['userId'],
        page: query.page || 0,
        limit: query.limit || 10,
      }),
    );
  }

  /**
   * u-7-13 findCommentReplies.
   * - RoleLevel: USER.
   *
   * 댓글의 대댓글을 조회합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/comment/:commentId/reply')
  async findCommentReplies(
    @Req() req: Request,
    @TypedParam('commentId') commentId: IComment['id'],
    @TypedQuery() query: FindCommentRepliesReqQuery,
  ): Promise<ResponseForm<FindCommentsRes>> {
    return createResponseForm(
      await this.commentsAppService.findCommentReplies({
        userId: req['userId'],
        parentId: commentId,
        page: query.page || 0,
        limit: query.limit || 10,
      }),
    );
  }

  /**
   * u-7-14 updateComment.
   * - RoleLevel: USER.
   *
   * 기존 댓글을 수정합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/comment/:commentId')
  async updatePostComment(
    @TypedParam('commentId') commentId: IComment['id'],
    @Req() req: Request,
    @TypedBody() body: UpdateCommentReqBody,
  ): Promise<ResponseForm<UpdateCommentRes>> {
    return createResponseForm(
      await this.commentsAppService.updateComment({
        userId: req['userId'],
        commentUpdateDto: { commentId, ...body },
      }),
    );
  }

  /**
   * u-7-15 deleteComment.
   * - RoleLevel: USER.
   *
   * 특정 댓글을 삭제합니다.
   *
   * @tag u-7 posts
   * @security bearer
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId')
  async deletePostComment(
    @Req() req: Request,
    @TypedParam('commentId') commentId: IPost['id'],
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.commentsAppService.deleteComment({
        userId: req['userId'],
        commentId,
      }),
    );
  }

  /**
   * u-7-16 createCommentLike.
   * - RoleLevel: USER.
   *
   * 댓글에 좋아요를 추가합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/comment/:commentId/like')
  async createPostCommentLike(
    @Req() req: Request,
    @TypedParam('commentId') commentId: IComment['id'],
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.commentsAppService.createCommentLike({
        commentLikeCreateDto: { userId: req['userId'], commentId },
      }),
    );
  }

  /**
   * u-7-17 deleteCommentLike.
   * - RoleLevel: USER.
   *
   * 댓글에 대한 좋아요를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId/like')
  async deletePostCommentLike(
    @TypedParam('commentId') commentId: IComment['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.commentsAppService.deleteCommentLike({
        userId: req['userId'],
        commentId,
      }),
    );
  }

  /**
   * u-7-18 createCommentReport.
   * - RoleLevel: USER.
   *
   * 댓글을 신고합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/comment/:commentId/report')
  async createPostCommentReport(
    @TypedParam('commentId') commentId: IComment['id'],
    @Req() req: Request,
    @TypedBody() body: CreateCommentReportReqBody,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.commentsAppService.createCommentReport({
        commentReportCreateDto: { userId: req['userId'], commentId, ...body },
      }),
    );
  }

  /**
   * u-7-19 deleteCommentReport.
   * - RoleLevel: USER.
   *
   * 댓글 신고를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId/report')
  async deletePostCommentReport(
    @TypedParam('commentId') commentId: IComment['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.commentsAppService.deleteCommentReport({
        userId: req['userId'],
        commentId,
      }),
    );
  }
}
