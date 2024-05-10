import { tags } from 'typia';
import { IComment } from './comment.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface ICommentSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Comment Id. */
  commentId: IComment['id'];

  /** Comment body. */
  body: string & tags.MinLength<1> & tags.MaxLength<1024>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;
}
