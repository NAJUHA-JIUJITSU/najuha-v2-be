import { tags } from 'typia';
import { IComment } from './comment.interface';
import { IUser } from '../../../users/domain/interface/user.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface ICommentReport {
  /** UUID v7. */
  id: TId;

  /** Report Type */
  type: TCommentReportType;

  /** Report Status */
  status: TCommentReportStatus;

  /** Report Reason */
  reason: string & tags.MaxLength<100>;

  /** Comment Id. */
  commentId: IComment['id'];

  /** User Id. */
  userId: IUser['id'];

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICommentReportModelData {
  id: ICommentReport['id'];
  type: ICommentReport['type'];
  status: ICommentReport['status'];
  reason: ICommentReport['reason'];
  commentId: ICommentReport['commentId'];
  userId: ICommentReport['userId'];
  createdAt: ICommentReport['createdAt'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ICommentReportCreateDto extends Pick<ICommentReport, 'commentId' | 'userId' | 'type' | 'reason'> {}

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
type TCommentReportType = 'INAPPROPRIATE' | 'SPAM';

type TCommentReportStatus = 'ACCEPTED' | 'REJECTED';
