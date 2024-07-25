import { IComment } from './comment.interface';
import { IUser } from '../../../users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * CommentLike.
 *
 * 댓글 좋아요 정보를 담는 Entity입니다.
 * 동일한 유저가 동일한 댓글에 여러 번 좋아요를 누를 수 없습니다. (중복 좋아요 불가능)
 *
 * @namespace Post
 */
export interface ICommentLike {
  /** UUID v7. */
  id: TId;

  /** 좋아요를 누른 UserId. */
  userId: IUser['id'];

  /** 좋아요 누른 일자. */
  createdAt: TDateOrStringDate;

  /** 좋아요를 누른 댓글의 Id. */
  commentId: IComment['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICommentLikeModelData {
  id: ICommentLike['id'];
  commentId: ICommentLike['commentId'];
  userId: ICommentLike['userId'];
  createdAt: ICommentLike['createdAt'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export type ICommentLikeCreateDto = Pick<ICommentLike, 'commentId' | 'userId'>;
