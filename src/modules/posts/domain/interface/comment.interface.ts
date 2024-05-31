import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPost } from './post.interface';
import { ICommentSnapshot } from './comment-snapshot.interface';
import { ICommentLike } from './comment-like.interface';
import { ICommentReport } from './comment-report.interface';
import { NotNull } from 'src/common/utility-types';

export interface IComment {
  /** ULID. */
  id: TId;

  /** Comment writer. */
  userId: IUser['id'];

  /** Comment parent. */
  parentId: IComment['id'] | null;

  /** Comment status. */
  status: 'ACTIVE' | 'INACTIVE';

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAt. */
  deletedAt: TDateOrStringDate | null;

  postId: IPost['id'];

  commentSnapshots: ICommentSnapshot[];
}

export interface ICommentCreateDto extends Pick<IComment, 'userId' | 'postId'>, Pick<ICommentSnapshot, 'body'> {}

export interface ICommentReplyCreateDto
  extends NotNull<Pick<IComment, 'userId' | 'postId' | 'parentId'>>,
    Pick<ICommentSnapshot, 'body'> {}

export interface ICommentUpdateDto extends Pick<ICommentSnapshot, 'commentId' | 'body'> {}
