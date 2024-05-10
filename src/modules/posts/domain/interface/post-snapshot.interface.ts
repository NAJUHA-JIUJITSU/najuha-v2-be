import { tags } from 'typia';
import { IPost } from './post.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IPostSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Post Id. */
  postId: IPost['id'];

  /** Post title. */
  title: string & tags.MinLength<1> & tags.MaxLength<64>;

  /** Post body. */
  body: string & tags.MinLength<1> & tags.MaxLength<4096>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;
}
