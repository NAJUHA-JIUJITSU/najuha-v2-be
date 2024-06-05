import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';

export interface IPostReport {
  /** UUID v7. */
  id: TId;

  /** Report Type */
  type: 'INAPPROPRIATE' | 'SPAM';

  /** Report Status */
  status: 'ACCEPTED' | 'REJECTED';

  /** Report Reason */
  reason: string & tags.MaxLength<100>;

  /** Post Id. */
  postId: IPost['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

export interface IPostReportCreateDto extends Pick<IPostReport, 'postId' | 'userId' | 'type' | 'reason'> {}
