import { tags } from 'typia';
import { IPost } from './post.interface';
import { DateOrStringDate } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

export interface IPostReport {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Post Id. */
  postId: IPost['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: DateOrStringDate;
}
