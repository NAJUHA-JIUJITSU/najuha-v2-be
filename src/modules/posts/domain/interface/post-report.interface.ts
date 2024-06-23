import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser } from '../../../users/domain/interface/user.interface';
import { tags } from 'typia';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IPostReportModelData {
  id: IPostReport['id'];
  type: IPostReport['type'];
  status: IPostReport['status'];
  reason: IPostReport['reason'];
  postId: IPostReport['postId'];
  userId: IPostReport['userId'];
  createdAt: IPostReport['createdAt'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPostReportCreateDto extends Pick<IPostReport, 'postId' | 'userId' | 'type' | 'reason'> {}
