import { tags } from 'typia';
import { IPost } from './post.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IPostLike {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Post Id. */
  postId: IPost['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: DateOrStringDate;
}
