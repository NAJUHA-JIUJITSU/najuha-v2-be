import { tags } from 'typia';
import { IComment } from './comment.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from 'src/common/common-types';

export interface ICommentLike {
  /** ULID. */
  id: TId;

  /** Comment Id. */
  commentId: IComment['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

export type ICommentLikeCreateDto = Pick<ICommentLike, 'commentId' | 'userId'>;
