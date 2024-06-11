import { tags } from 'typia';
import { IComment } from './comment.interface';
import { IUser } from '../../../users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';

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

export type ICommentLikeCreateDto = Pick<ICommentLike, 'commentId' | 'userId'>;
