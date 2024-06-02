import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  IFindCommentsQueryOptions,
  IComment,
  ICommentCreateDto,
  ICommentReplyCreateDto,
  ICommentRet,
  ICommentUpdateDto,
  IFindCommentRepliesQueryOptions,
} from '../domain/interface/comment.interface';
import { ICommentLikeCreateDto } from '../domain/interface/comment-like.interface';
import { ICommentReportCreateDto } from '../domain/interface/comment-report.interface';
import { IPaginationParam, IPaginationRet } from 'src/common/common-types';

// ---------------------------------------------------------------------------
// commentAppService Param
// ---------------------------------------------------------------------------
export interface CreateCommentParam {
  commentCreateDto: ICommentCreateDto;
}

export interface CreateCommentReplyParam {
  commentReplyCreateDto: ICommentReplyCreateDto;
}

export interface FindCommentsParam extends IPaginationParam, IFindCommentsQueryOptions {}

export interface FindCommentRepliesParam extends IPaginationParam, IFindCommentRepliesQueryOptions {}

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
  comment: ICommentRet;
}

export interface CreateCommentReplyRet {
  comment: ICommentRet;
}

export interface FindCommentsRet extends IPaginationRet {
  comments: ICommentRet[];
}

export interface UpdateCommentRet {
  comment: ICommentRet;
}
