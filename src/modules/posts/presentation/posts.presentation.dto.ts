import { CreateCommentReplyRet, CreateCommentRet, UpdateCommentRet } from '../application/comments.app.dto';
import { CreatePostRet, FindPostsRet, GetPostRet, UpdatePostRet } from '../application/posts.app.dto';
import { ICommentCreateDto, ICommentReplyCreateDto, ICommentUpdateDto } from '../domain/interface/comment.interface';
import { IPostReportCreateDto } from '../domain/interface/post-report.interface';
import { IPostCreateDto, IPostUpdateDto } from '../domain/interface/post.interface';

// ---------------------------------------------------------------------------
// postsController Request
// ---------------------------------------------------------------------------
export interface CreatePostReqBody extends Omit<IPostCreateDto, 'userId'> {}

export interface FindPostsQuery {
  page?: number;
  limit?: number;
}

export interface UpdatePostReqBody extends Omit<IPostUpdateDto, 'postId'> {}

export interface CreatePostReportReqBody extends Omit<IPostReportCreateDto, 'userId' | 'postId'> {}

export interface CreateCommentReqBody extends Omit<ICommentCreateDto, 'userId' | 'postId'> {}

export interface CreateCommentReplyReqBody extends Omit<ICommentReplyCreateDto, 'userId' | 'postId' | 'parentId'> {}

export interface UpdateCommentReqBody extends Omit<ICommentUpdateDto, 'commentId'> {}

// ---------------------------------------------------------------------------
// postsController Response
// ---------------------------------------------------------------------------
export interface CreatePostRes extends CreatePostRet {}

export interface UpdatePostRes extends UpdatePostRet {}

export interface GetPostRes extends GetPostRet {}

export interface FindPostsRes extends FindPostsRet {}

export interface CreateCommentRes extends CreateCommentRet {}

export interface CreateCommentReplyRes extends CreateCommentReplyRet {}

export interface UpdateCommentRes extends UpdateCommentRet {}
