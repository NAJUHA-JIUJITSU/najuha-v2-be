import { IComment } from './comment.interface';
import { IUser } from '../../../users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface ICommentLike {
  /** UUID v7. */
  id: TId;

  /** Comment Id. */
  commentId: IComment['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
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
