import { tags } from 'typia';
import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from 'src/common/common-types';

export interface IPostSnapshot {
  /** UUID v7. */
  id: TId;

  /** Post Id. */
  postId: IPost['id'];

  /** Post title. */
  title: string & tags.MinLength<1> & tags.MaxLength<64>;

  /** Post body. */
  body: string & tags.MinLength<1> & tags.MaxLength<4096>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}
