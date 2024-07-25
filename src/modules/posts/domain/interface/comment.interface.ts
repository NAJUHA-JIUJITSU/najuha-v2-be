import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser, IUserModelData, IUserPublicProfile } from '../../../users/domain/interface/user.interface';
import { IPost } from './post.interface';
import { ICommentSnapshot, ICommentSnapshotModelData } from './comment-snapshot.interface';
import { ICommentLike, ICommentLikeModelData } from './comment-like.interface';
import { ICommentReport, ICommentReportModelData } from './comment-report.interface';
import { NotNull } from '../../../../common/utility-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * Comment, CommentReply.
 * 댓글 or 대댓글을 식별하는 최상위 엔티티로서 개별 댓글의 메타데이터를 담고 있습니다.
 *
 * 댓글의 내용(body) `comment`에 존재하지 않고, `comment_snapshot`에 저장되어 있습니다.
 * `comment`와 `comment_snapshot`는 1:N 관계로 연결되어 있는데, 이는 댓글이 수정될때마다 새로운 스냅샷 레코드가 생성되기 때문입니다.
 *
 * 댓글이 수정될때마다 새로운 스냅샷 레코드가 생성되는 이유는 증거를 보존 및 추적하기 위함입니다. 온라인 커뮤니티의 특성상 참여자 간에는 항상 분쟁의 위험이 존재합니다.
 * 그리고 분쟁은 글이나 댓글을 통해 발생할 수 있으며, 기존 댓글을 수정하여 상황을 조작하는 등의 행위를 방지하기 위해 이러한 구조로 설계되었습니다. 즉, 증거를 보관하고 사기를 방지하기 위한 것입니다.
 *
 * 대댓글은 부모 댓글의 `id`를 `parentId`에 저장하여 관계를 맺습니다. 대댓글의 depth는 1로 제한되어 있습니다. 즉 대댓글의 대댓글은 생성할 수 없습니다.
 *
 * @namespace Post
 */
export interface IComment {
  /** UUID v7. */
  id: TId;

  /** 댓글 작성자 UserId. */
  userId: IUser['id'];

  /**
   * 부모 댓글 Id.
   * - 댓글의 경우 `null`을 저장합니다.
   * - 대댓글의 경우 부모 댓글의 `id`를 저장합니다.
   */
  parentId: IComment['id'] | null;

  /**
   * 대댓글 수.
   *
   * - 조회할 때만 사용되며, DB에 저장되지 않습니다회
   */
  replyCount: number;

  /**
   * 댓글 상태. default: `ACTIVE`.
   * - `ACTIVE`: 유저에게 노출.
   * - `INACTIVE`: 유저에게 노출되지 않음.
   * 관리자의 판단 하에 `INACTIVE`로 변경될 수 있습니다.
   * 신고 회수가 10회 이상이면 자동으로 `INACTIVE` 처리됩니다. 관리자의 판단 하에 `ACTIVE`로 변경될 수 있습니다.
   */
  status: TCommentStatus;

  /** 댓글 작성일자. */
  createdAt: TDateOrStringDate;

  /** 댓글 삭제일자. */
  deletedAt: TDateOrStringDate | null;

  /** 게시글 Id. */
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
  replyCount: IComment['replyCount'];
  status: IComment['status'];
  createdAt: IComment['createdAt'];
  deletedAt: IComment['deletedAt'];
  postId: IComment['postId'];
  likeCount?: IComment['likeCount'];
  userLiked?: IComment['userLiked'];
  commentSnapshots: ICommentSnapshotModelData[];
  likes?: ICommentLikeModelData[];
  reports?: ICommentReportModelData[];
  user?: IUserModelData;
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
    | 'replyCount'
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
export interface ICommentCreateDto extends Pick<IComment, 'userId' | 'postId'>, Pick<ICommentSnapshot, 'body'> {}

export interface ICommentReplyCreateDto
  extends NotNull<Pick<IComment, 'userId' | 'postId' | 'parentId'>>,
    Pick<ICommentSnapshot, 'body'> {}

export interface ICommentUpdateDto extends Pick<ICommentSnapshot, 'commentId' | 'body'> {}

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
