import {
  CreateCommentParam,
  CreateCommentReplyParam,
  CreateCommentReplyRet,
  CreateCommentReportParam,
  CreateCommentRet,
  FindCommentsRet,
  UpdateCommentParam,
  UpdateCommentRet,
} from '../application/comments.app.dto';
import {
  CreatePostParam,
  CreatePostReportParam,
  CreatePostRet,
  FindPostsRet,
  GetPostRet,
  UpdatePostParam,
  UpdatePostRet,
} from '../application/posts.app.dto';
import { IFindPostsQueryOptions } from '../domain/interface/post.interface';
import { TPaginationParam } from '../../../common/common-types';

// ---------------------------------------------------------------------------
// postsController Request
// ---------------------------------------------------------------------------
export interface CreatePostReqBody extends Omit<CreatePostParam, 'userId'> {}

export interface FindPostsReqQuery
  extends Partial<TPaginationParam<Omit<IFindPostsQueryOptions, 'userId' | 'status'>>> {}

export interface UpdatePostReqBody extends Omit<UpdatePostParam, 'userId' | 'postId'> {}

export interface CreatePostReportReqBody extends Omit<CreatePostReportParam, 'userId' | 'postId'> {}

//

export interface CreateCommentReqBody extends Omit<CreateCommentParam, 'userId' | 'postId'> {}

export interface CreateCommentReplyReqBody extends Omit<CreateCommentReplyParam, 'userId' | 'postId' | 'parentId'> {}

export interface FindCommentsReqQuery extends Partial<TPaginationParam<void>> {}

export interface FindRepliesReqQuery extends Partial<TPaginationParam<void>> {}

export interface UpdateCommentReqBody extends Omit<UpdateCommentParam, 'userId' | 'commentId'> {}

export interface CreateCommentReportReqBody extends Omit<CreateCommentReportParam, 'userId' | 'commentId'> {}

// ---------------------------------------------------------------------------
// postsController Response
// ---------------------------------------------------------------------------
export interface CreatePostRes extends CreatePostRet {}

export interface UpdatePostRes extends UpdatePostRet {}

export interface GetPostRes extends GetPostRet {}

export interface FindPostsRes extends FindPostsRet {}

export interface CreateCommentRes extends CreateCommentRet {}

export interface CreateCommentReplyRes extends CreateCommentReplyRet {}

export interface FindCommentsRes extends FindCommentsRet {}

export interface UpdateCommentRes extends UpdateCommentRet {}
