import { tags } from 'typia';
import { IComment } from './comment.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';

export interface ICommentSnapshot {
  /** UUID v7. */
  id: TId;

  /** Comment Id. */
  commentId: IComment['id'];

  /** Comment body. */
  body: string & tags.MinLength<1> & tags.MaxLength<1024>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

export interface ICommentSnapshotModelData {
  id: ICommentSnapshot['id'];
  commentId: ICommentSnapshot['commentId'];
  body: ICommentSnapshot['body'];
  createdAt: ICommentSnapshot['createdAt'];
}

export interface ICommentSnapshotCreateDto extends Pick<ICommentSnapshot, 'commentId' | 'body'> {}
