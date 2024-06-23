import { tags } from 'typia';
import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IPostSnapshotImage, IPostSnapshotImageModleData } from './post-snapshot-image.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IPostSnapshotModelData {
  id: IPostSnapshot['id'];
  postId: IPostSnapshot['postId'];
  title: IPostSnapshot['title'];
  body: IPostSnapshot['body'];
  createdAt: IPostSnapshot['createdAt'];
  postSnapshotImages?: IPostSnapshotImageModleData[];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPostSnapshotCreateDto extends Pick<IPostSnapshot, 'postId' | 'title' | 'body'> {}
