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
  FindCommentsReqQuery,
  FindCommentsRes,
  FindPostsReqQuery,
  FindPostsRes,
  FindRepliesReqQuery,
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
   * - 새로운 게시글을 작성합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param body CreatePostReqBody 게시글 작성 요청 본문
   * @returns CreatePostRes 게시글 작성 응답
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
   * - 여러 게시글을 조회합니다.
   * - ACTIVE 상태인 게시글들만 조회합니다.
   * - api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 있습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param query FindPostsReqQuery 게시글 조회 쿼리
   * @returns FindPostsRes 게시글 조회 결과
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/')
  async findPosts(@Req() req: Request, @TypedQuery() query: FindPostsReqQuery): Promise<ResponseForm<FindPostsRes>> {
    return createResponseForm(
      await this.postsAppService.findPosts({
        page: query.page || 0,
        limit: query.limit || 10,
        userId: req['userId'],
        status: 'ACTIVE',
        categoryFilters: query.categoryFilters,
        sortOption: query.sortOption || '최신순',
      }),
    );
  }

  /**
   * u-7-3 getPost.
   * - RoleLevel: USER.
   * - 특정 게시글을 조회합니다.
   * - api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 있습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @returns GetPostRes 게시글 조회 결과
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
   * - 본인이 작성한 게시글을 수정합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @param body UpdatePostReqBody 게시글 수정 요청 본문
   * @returns UpdatePostRes 게시글 수정 결과
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
   * - 본인이 작성한 게시글을 삭제합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @returns void 게시글 삭제 결과
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:postId')
  async deletePost(@Req() req: Request, @TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<void>> {
    return createResponseForm(await this.postsAppService.deletePost({ userId: req['userId'], postId }));
  }

  /**
   * u-7-6 createPostLike.
   * - RoleLevel: USER.
   * - 게시글에 좋아요를 추가합니다.
   * - 동일한 게시물에 중복으로 좋아요를 누를 수 없습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param postId 게시글 id
   * @param req Request 객체
   * @returns void 좋아요 추가 결과
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
   * - 게시글에 대한 좋아요를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @returns void 좋아요 취소 결과
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
   * - 게시글을 신고합니다.
   * - 동일한 게시물에 중복으로 신고를 할 수 없습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @param body CreatePostReportReqBody 게시글 신고 요청 본문
   * @returns void 게시글 신고 결과
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
   * - 게시글 신고를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @returns void 게시글 신고 취소 결과
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
   * - 게시글에 댓글을 추가합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param postId 게시글 id
   * @param req Request 객체
   * @param body CreateCommentReqBody 댓글 작성 요청 본문
   * @returns CreateCommentRes 댓글 작성 결과
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
   * - 댓글에 대한 대댓글을 추가합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param postId 게시글 id
   * @param commentId 댓글 id
   * @param req Request 객체
   * @param body CreateCommentReplyReqBody 대댓글 작성 요청 본문
   * @returns CreateCommentReplyRes 대댓글 작성 결과
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
   * - 게시글의 댓글들을 조회합니다.
   * - api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 있습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param postId 게시글 id
   * @param query FindCommentsReqQuery 댓글 조회 쿼리
   * @returns FindCommentsRes 댓글 조회 결과
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
        type: 'COMMENT',
        status: 'ACTIVE',
        page: query.page || 0,
        limit: query.limit || 10,
      }),
    );
  }

  /**
   * u-7-13 findCommentReplies.
   * - RoleLevel: USER.
   * - 댓글의 대댓글들을 조회합니다.
   * - api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 있습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param commentId 댓글 id
   * @param query FindCommentRepliesReqQuery 대댓글 조회 쿼리
   * @returns FindCommentsRes 대댓글 조회 결과
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:postId/comment/:commentId/reply')
  async findCommentReplies(
    @Req() req: Request,
    @TypedParam('postId') postId: IPost['id'],
    @TypedParam('commentId') commentId: IComment['id'],
    @TypedQuery() query: FindRepliesReqQuery,
  ): Promise<ResponseForm<FindCommentsRes>> {
    return createResponseForm(
      await this.commentsAppService.findReplies({
        userId: req['userId'],
        postId,
        parentId: commentId,
        type: 'REPLY',
        status: 'ACTIVE',
        page: query.page || 0,
        limit: query.limit || 10,
      }),
    );
  }

  /**
   * u-7-14 updateComment.
   * - RoleLevel: USER.
   * - 본인이 작성한 댓글 or 대댓글을 수정합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param commentId 댓글 id
   * @param req Request 객체
   * @param body UpdateCommentReqBody 댓글 수정 요청 본문
   * @returns UpdateCommentRes 댓글 수정 결과
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
   * - 본인이 작성한 댓글 or 대댓글을 삭제합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param req Request 객체
   * @param commentId 댓글 id
   * @returns void 댓글 삭제 결과
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/comment/:commentId')
  async deletePostComment(
    @Req() req: Request,
    @TypedParam('commentId') commentId: IComment['id'],
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
   * - 댓글에 좋아요를 추가합니다.
   * - 동일한 댓글에 중복으로 좋아요를 누를 수 없습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param commentId 댓글 id
   * @param req Request 객체
   * @returns void 좋아요 추가 결과
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
   * - 댓글에 대한 좋아요를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param commentId 댓글 id
   * @param req Request 객체
   * @returns void 좋아요 취소 결과
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
   * - 댓글을 신고합니다.
   * - 동일한 댓글에 중복으로 신고를 할 수 없습니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param commentId 댓글 id
   * @param req Request 객체
   * @param body CreateCommentReportReqBody 댓글 신고 요청 본문
   * @returns void 댓글 신고 결과
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
   * - 댓글 신고를 취소합니다.
   *
   * @tag u-7 posts
   * @security bearer
   * @param commentId 댓글 id
   * @param req Request 객체
   * @returns void 댓글 신고 취소 결과
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
