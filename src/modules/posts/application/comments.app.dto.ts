import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  IComment,
  ICommentCreateDto,
  ICommentReplyCreateDto,
  ICommentDetail,
  ICommentUpdateDto,
  IFindCommentsAndRepliesQueryOptions,
  IFindCommentsQueryOptions,
  IFindRepliesQueryOptions,
} from '../domain/interface/comment.interface';
import { ICommentLikeCreateDto } from '../domain/interface/comment-like.interface';
import { ICommentReportCreateDto } from '../domain/interface/comment-report.interface';
import { TPaginationParam, TPaginationRet } from 'src/common/common-types';

// ---------------------------------------------------------------------------
// commentAppService Param
// ---------------------------------------------------------------------------
export interface CreateCommentParam {
  commentCreateDto: ICommentCreateDto;
}

export interface CreateCommentReplyParam {
  commentReplyCreateDto: ICommentReplyCreateDto;
}

export interface FindCommentsParam extends TPaginationParam<IFindCommentsQueryOptions> {}

export interface FindRepliesParam extends TPaginationParam<IFindRepliesQueryOptions> {}

export interface FindCommentsAndRepliesParam extends TPaginationParam<IFindCommentsAndRepliesQueryOptions> {}

export interface UpdateCommentParam {
  userId: IUser['id'];
  commentUpdateDto: ICommentUpdateDto;
}

export interface DeleteCommentParam {
  userId: IUser['id'];
  commentId: IComment['id'];
}

export interface CreateCommentLikeParam {
  commentLikeCreateDto: ICommentLikeCreateDto;
}

export interface DeleteCommentLikeParam {
  userId: IUser['id'];
  commentId: IComment['id'];
}

export interface CreateCommentReportParam {
  commentReportCreateDto: ICommentReportCreateDto;
}

export interface DeleteCommentReportParam {
  userId: IUser['id'];
  commentId: IComment['id'];
}

// ---------------------------------------------------------------------------
// commentAppService Result
// ---------------------------------------------------------------------------
export interface CreateCommentRet {
  comment: ICommentDetail;
}

export interface CreateCommentReplyRet {
  comment: ICommentDetail;
}

export interface FindCommentsRet
  extends TPaginationRet<{
    comments: ICommentDetail[];
  }> {}

export interface UpdateCommentRet {
  comment: ICommentDetail;
}
