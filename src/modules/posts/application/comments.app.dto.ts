import { IUser } from '../../users/domain/interface/user.interface';
import {
  IComment,
  ICommentDetail,
  IFindCommentsAndRepliesQueryOptions,
  IFindCommentsQueryOptions,
  IFindRepliesQueryOptions,
  ICommentCreateDto,
  ICommentReplyCreateDto,
} from '../domain/interface/comment.interface';
import { ICommentLikeCreateDto } from '../domain/interface/comment-like.interface';
import { ICommentReportCreateDto } from '../domain/interface/comment-report.interface';
import { TPaginationParam, TPaginationRet } from '../../../common/common-types';
import { ICommentSnapshotCreateDto } from '../domain/interface/comment-snapshot.interface';

// ---------------------------------------------------------------------------
// commentAppService Param
// ---------------------------------------------------------------------------
export interface CreateCommentParam
  extends Pick<ICommentCreateDto, 'userId' | 'postId'>,
    Pick<ICommentSnapshotCreateDto, 'body'> {}

export interface CreateCommentReplyParam
  extends Pick<ICommentReplyCreateDto, 'userId' | 'postId' | 'parentId'>,
    Pick<ICommentSnapshotCreateDto, 'body'> {}

export interface FindCommentsParam extends TPaginationParam<IFindCommentsQueryOptions> {}

export interface FindRepliesParam extends TPaginationParam<IFindRepliesQueryOptions> {}

export interface FindCommentsAndRepliesParam extends TPaginationParam<IFindCommentsAndRepliesQueryOptions> {}

export interface UpdateCommentParam extends Pick<ICommentSnapshotCreateDto, 'commentId' | 'body'> {
  userId: IUser['id'];
}

export interface DeleteCommentParam {
  userId: IUser['id'];
  commentId: IComment['id'];
}

export interface CreateCommentLikeParam extends Pick<ICommentLikeCreateDto, 'userId' | 'commentId'> {}

export interface DeleteCommentLikeParam {
  userId: IUser['id'];
  commentId: IComment['id'];
}

export interface CreateCommentReportParam
  extends Pick<ICommentReportCreateDto, 'commentId' | 'userId' | 'type' | 'reason'> {}

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
