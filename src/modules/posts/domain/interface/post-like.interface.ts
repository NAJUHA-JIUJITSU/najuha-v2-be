import { tags } from 'typia';
import { IPost } from './post.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from 'src/common/common-types';

export interface IPostLike {
  /** ULID. */
  id: TId;

  /** Post Id. */
  postId: IPost['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}
