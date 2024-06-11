import { tags } from 'typia';
import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IPostSnapshotImage } from './post-snapshot-image.interface';

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

  /** PostSnapshotImages. */
  postSnapshotImages: IPostSnapshotImage[] & tags.MaxItems<5>;
}

export interface IPostSnapshotCreateDto extends Pick<IPostSnapshot, 'postId' | 'title' | 'body'> {}
