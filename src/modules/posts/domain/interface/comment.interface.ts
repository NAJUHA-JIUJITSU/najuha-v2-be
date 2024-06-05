import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPost } from './post.interface';
import { ICommentSnapshot } from './comment-snapshot.interface';
import { ICommentLike } from './comment-like.interface';
import { ICommentReport } from './comment-report.interface';
import { NotNull } from 'src/common/utility-types';

export interface IComment {
  /** UUID v7. */
  id: TId;

  /** Comment writer. */
  userId: IUser['id'];

  /** Comment parent. */
  parentId: IComment['id'] | null;

  /** Comment status. */
  status: 'ACTIVE' | 'INACTIVE';

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAt. */
  deletedAt: TDateOrStringDate | null;

  /** PostId. */
  postId: IPost['id'];

  commentSnapshots: ICommentSnapshot[];

  likes?: ICommentLike[];

  reports?: ICommentReport[];

  likeCount?: number;

  userLiked?: boolean;
}

export interface ICommentRet
  extends Required<
    Pick<
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
    >
  > {}

export interface ICommentCreateDto extends Pick<IComment, 'userId' | 'postId'>, Pick<ICommentSnapshot, 'body'> {}

export interface ICommentReplyCreateDto
  extends NotNull<Pick<IComment, 'userId' | 'postId' | 'parentId'>>,
    Pick<ICommentSnapshot, 'body'> {}

export interface ICommentUpdateDto extends Pick<ICommentSnapshot, 'commentId' | 'body'> {}

export interface IFindCommentsQueryOptions {
  /**
   * Post ID.
   * 해당 게시글의 댓글을 조회하기 위해 사용됩니다.
   */
  postId: IPost['id'];

  /**
   * User ID.
   * 댓글의 좋아요 여부를 판단하기 위해 사용됩니다.
   */
  userId?: IUser['id'];
}

export interface IFindCommentRepliesQueryOptions {
  /**
   * Parent comment ID.
   * 해당 댓글의 대댓글을 조회하기 위해 사용됩니다.
   */
  parentId: IComment['id'];

  /**
   * User ID.
   * 대댓글의 좋아요 여부를 판단하기 위해 사용됩니다.
   */
  userId?: IUser['id'];
}
