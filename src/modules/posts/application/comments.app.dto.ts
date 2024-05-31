import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  IComment,
  ICommentCreateDto,
  ICommentReplyCreateDto,
  ICommentUpdateDto,
} from '../domain/interface/comment.interface';
import { ICommentLikeCreateDto } from '../domain/interface/comment-like.interface';
import { ICommentReportCreateDto } from '../domain/interface/comment-report.interface';

// ---------------------------------------------------------------------------
// commentAppService Param
// ---------------------------------------------------------------------------
export interface CreateCommentParam {
  commentCreateDto: ICommentCreateDto;
}

export interface CreateCommentReplyParam {
  commentReplyCreateDto: ICommentReplyCreateDto;
}

export interface FindCommentsParam {
  page: number;
  limit: number;
}

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
  comment: IComment;
}

export interface CreateCommentReplyRet {
  comment: IComment;
}

export interface FindCommentsRet {
  comments: IComment[];
  nextPage?: number;
}

export interface UpdateCommentRet {
  comment: IComment;
}
