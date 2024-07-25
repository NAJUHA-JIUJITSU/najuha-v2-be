import { tags } from 'typia';
import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IPostSnapshotImage, IPostSnapshotImageModleData } from './post-snapshot-image.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * PostSnapshot.
 *
 * 게시글의 스냅샷 정보를 담는 Entity입니다.
 * `post`에서 언급한 것처럼 증거를 보관하고 사기를 방지하기 위해 게시글 레코드에서 게시글 내용을 분리하여 보관합니다.
 *
 * @namespace Post
 */
export interface IPostSnapshot {
  /** UUID v7. */
  id: TId;

  /** 게시글 제목. */
  title: string & tags.MinLength<1> & tags.MaxLength<64>;

  /** 게시글 내용. */
  body: string & tags.MinLength<1> & tags.MaxLength<4096>;

  /** 게시글 작성일자. */
  createdAt: TDateOrStringDate;

  /** PostSnapshotImages. */
  postSnapshotImages: IPostSnapshotImage[] & tags.MaxItems<5>;

  /** Post Id. */
  postId: IPost['id'];
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
  postSnapshotImages: IPostSnapshotImageModleData[];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPostSnapshotCreateDto extends Pick<IPostSnapshot, 'postId' | 'title' | 'body'> {}
