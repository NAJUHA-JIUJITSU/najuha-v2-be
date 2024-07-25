import { tags } from 'typia';
import { IComment } from './comment.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * CommentSnapshot.
 *
 * 댓글의 스냅샷 정보를 담는 Entity입니다.
 * `comment`에서 언급한 것처럼 증거를 보관하고 사기를 방지하기 위해 댓글 레코드에서 댓글 내용을 분리하여 보관합니다.
 *
 * @namespace Post
 */
export interface ICommentSnapshot {
  /** UUID v7. */
  id: TId;

  /** 댓글 Id. */
  commentId: IComment['id'];

  /** 댓글 내용. */
  body: string & tags.MinLength<1> & tags.MaxLength<1024>;

  /** 댓글 작성일자. */
  createdAt: TDateOrStringDate;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICommentSnapshotModelData {
  id: ICommentSnapshot['id'];
  commentId: ICommentSnapshot['commentId'];
  body: ICommentSnapshot['body'];
  createdAt: ICommentSnapshot['createdAt'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ICommentSnapshotCreateDto extends Pick<ICommentSnapshot, 'commentId' | 'body'> {}
