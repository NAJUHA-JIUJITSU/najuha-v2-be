import { tags } from 'typia';
import { IComment } from './comment.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from 'src/common/common-types';

export interface ICommentReport {
  /** ULID. */
  id: TId;

  /** Report Type */
  type: 'INAPPROPRIATE' | 'SPAM';

  /** Report Status */
  status: 'PENDING' | 'REJECTED' | 'ACCEPTED';

  /** Report Reason */
  reason: string & tags.MaxLength<100>;

  /** Comment Id. */
  commentId: IComment['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

export interface ICommentReportCreateDto extends Pick<ICommentReport, 'commentId' | 'userId' | 'type' | 'reason'> {}
