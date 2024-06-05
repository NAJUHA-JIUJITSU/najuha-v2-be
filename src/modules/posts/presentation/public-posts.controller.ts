import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { IPost } from '../domain/interface/post.interface';
import { PostsAppService } from '../application/posts.app.service';
import {
  FindCommentRepliesReqQuery,
  FindCommentsReqQuery,
  FindCommentsRes,
  FindPostsReqQuery,
  FindPostsRes,
  GetPostRes,
} from './posts.presentation.dto';
import { IComment } from '../domain/interface/comment.interface';
import { CommentsAppService } from '../application/comments.app.service';

@Controller('public/posts')
export class PublicPostsController {
  constructor(
    private readonly postsAppService: PostsAppService,
    private readonly commentsAppService: CommentsAppService,
  ) {}

  // ------------------------------------------------------------
  // Post API
  // ------------------------------------------------------------
  /**
   * p-7-1 findPosts.
   * - RoleLevel: PUBLIC.
   * - 여러 게시글을 조회합니다.
   * - ACTIVE 상태인 게시글들만 조회합니다.
   * - public api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 없습니다.
   *
   * @tag p-7 posts
   * @param query FindPostsReqQuery 게시글 조회 쿼리
   * @returns FindPostsRes 게시글 조회 결과
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/')
  async findPosts(@TypedQuery() query: FindPostsReqQuery): Promise<ResponseForm<FindPostsRes>> {
    return createResponseForm(
      await this.postsAppService.findPosts({
        page: query.page || 0,
        limit: query.limit || 10,
        status: 'ACTIVE',
        categoryFilters: query.categoryFilters,
        sortOption: query.sortOption || '최신순',
      }),
    );
  }

  /**
   * p-7-2 getPost.
   * - RoleLevel: PUBLIC.
   * - 특정 게시글을 조회합니다.
   * - public api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 없습니다.
   *
   * @tag p-7 posts
   * @param postId 게시글 id
   * @returns GetPostRes 게시글 조회 결과
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/:postId')
  async getPost(@TypedParam('postId') postId: IPost['id']): Promise<ResponseForm<GetPostRes>> {
    return createResponseForm(
      await this.postsAppService.getPost({
        postId,
      }),
    );
  }

  // ------------------------------------------------------------
  // Comment API
  // ------------------------------------------------------------
  /**
   * p-7-3- findComments.
   * - RoleLevel: PUBLIC.
   * - 게시글의 댓글을 조회합니다.
   * - public api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 없습니다.
   *
   * @tag p-7 posts
   * @param postId 게시글 id
   * @param query FindCommentsReqQuery 댓글 조회 쿼리
   * @returns FindCommentsRes 댓글 조회 결과
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/:postId/comment')
  async findComments(
    @TypedParam('postId') postId: IPost['id'],
    @TypedQuery() query: FindCommentsReqQuery,
  ): Promise<ResponseForm<FindCommentsRes>> {
    return createResponseForm(
      await this.commentsAppService.findComments({
        postId,
        page: query.page || 0,
        limit: query.limit || 10,
      }),
    );
  }

  /**
   * p-7-4 findCommentReplies.
   * - RoleLevel: PUBLIC.
   * - 댓글의 대댓글을 조회합니다.
   * - public api 호출 유저가 좋아요를 눌렀는지 여부를 확인할 수 없습니다.
   *
   * @tag p-7 posts
   * @param commentId 댓글 id
   * @param query FindCommentRepliesReqQuery 대댓글 조회 쿼리
   * @returns FindCommentsRes 대댓글 조회 결과
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/comment/:commentId/reply')
  async findCommentReplies(
    @TypedParam('commentId') commentId: IComment['id'],
    @TypedQuery() query: FindCommentRepliesReqQuery,
  ): Promise<ResponseForm<FindCommentsRes>> {
    return createResponseForm(
      await this.commentsAppService.findCommentReplies({
        parentId: commentId,
        page: query.page || 0,
        limit: query.limit || 10,
      }),
    );
  }
}
