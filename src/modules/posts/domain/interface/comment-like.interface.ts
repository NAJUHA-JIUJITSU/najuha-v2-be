import { tags } from 'typia';
import { IComment } from './comment.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface ICommentLike {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Comment Id. */
  commentId: IComment['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: DateOrStringDate;
}
