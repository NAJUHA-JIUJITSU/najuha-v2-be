import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser, IUserPublicProfile } from '../../../users/domain/interface/user.interface';
import { IPost } from './post.interface';
import { ICommentSnapshot, ICommentSnapshotModelData } from './comment-snapshot.interface';
import { ICommentLike, ICommentLikeModelData } from './comment-like.interface';
import { ICommentReport, ICommentReportModelData } from './comment-report.interface';
import { NotNull } from '../../../../common/utility-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IComment {
  /** UUID v7. */
  id: TId;

  /** Comment writer. */
  userId: IUser['id'];

  /** Comment parent. */
  parentId: IComment['id'] | null;

  /** Comment status. */
  status: TCommentStatus;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAt. */
  deletedAt: TDateOrStringDate | null;

  /** PostId. */
  postId: IPost['id'];

  commentSnapshots: ICommentSnapshot[];

  likes: ICommentLike[];

  reports: ICommentReport[];

  likeCount: number;

  userLiked: boolean;

  user: IUserPublicProfile;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICommentModelData {
  id: IComment['id'];
  userId: IComment['userId'];
  parentId: IComment['parentId'];
  status: IComment['status'];
  createdAt: IComment['createdAt'];
  deletedAt: IComment['deletedAt'];
  postId: IComment['postId'];
  likeCount?: IComment['likeCount'];
  userLiked?: IComment['userLiked'];
  commentSnapshots: ICommentSnapshotModelData[];
  likes?: ICommentLikeModelData[];
  reports?: ICommentReportModelData[];
  user?: IComment['user'];
}

// ----------------------------------------------------------------------------
// return interface
// ----------------------------------------------------------------------------
export interface ICommentDetail
  extends Pick<
    IComment,
    | 'id'
    | 'userId'
    | 'parentId'
    | 'status'
    | 'createdAt'
    | 'deletedAt'
    | 'postId'
    | 'commentSnapshots'
    | 'likeCount'
    | 'userLiked'
    | 'user'
  > {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ICommentCreateDto extends Pick<IComment, 'userId' | 'postId'> {}

export interface ICommentReplyCreateDto extends NotNull<Pick<IComment, 'userId' | 'postId' | 'parentId'>> {}

// ----------------------------------------------------------------------------
// Query Options
// ----------------------------------------------------------------------------
/** 댓글만 조회하는 쿼리 옵션. */
export interface IFindCommentsQueryOptions {
  type: 'COMMENT';
  status?: TCommentStatus;
  postId: IPost['id'];
  /** 유저가 좋아요를 눌렀는지 확인하기 위한 userId. */
  userId?: IUser['id'];
}

/** 대댓글만 조회하는 쿼리 옵션. */
export interface IFindRepliesQueryOptions {
  type: 'REPLY';
  status?: TCommentStatus;
  postId: IPost['id'];
  /** 대댓글의 부모 댓글 id. */
  parentId: IComment['id'];
  /** 유저가 좋아요를 눌렀는지 확인하기 위한 userId. */
  userId?: IUser['id'];
}

/** 댓글과 대댓글을 모두 조회하는 쿼리 옵션. */
export interface IFindCommentsAndRepliesQueryOptions {
  type: 'COMMENT_AND_REPLY';
  status?: TCommentStatus;
  postId: IPost['id'];
  /** 유저가 좋아요를 눌렀는지 확인하기 위한 userId. */
  userId?: IUser['id'];
}

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
type TCommentStatus = 'ACTIVE' | 'INACTIVE';
