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

  /**
   * 신고 타입.
   * - SPAM_CLICKBAIT: 낚시 / 놀람 / 도배
   * - COMMERCIAL_ADVERTISING: 상업적 광고 및 판매
   * - SEXUAL_CONTENT: 음란성 / 선정적
   * - ABUSE_HARASSMENT: 욕설/비하
   * - POLITICAL_DISPARAGEMENT: 정당/정치인 비하 및 선거운동
   * - IMPERSONATION_FRAUD: 유출/사칭/사기
   * - ILLEGAL_DISTRIBUTION: 불법촬영물 등의 유통
   * - RELIGIOUS_PROSELYTIZING: 종교 포교 시도
   * - INAPPROPRIATE_CONTENT: 게시판 성격에 부적절함
   */
  type: TPostReportType;

  /** Report Status */
  status: TPostReportStatus;

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
  postId: IPostReport['postId'];
  userId: IPostReport['userId'];
  createdAt: IPostReport['createdAt'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPostReportCreateDto extends Pick<IPostReport, 'postId' | 'userId' | 'type'> {}

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
type TPostReportType =
  | 'SPAM_CLICKBAIT'
  | 'COMMERCIAL_ADVERTISING'
  | 'SEXUAL_CONTENT'
  | 'ABUSE_HARASSMENT'
  | 'POLITICAL_DISPARAGEMENT'
  | 'IMPERSONATION_FRAUD'
  | 'ILLEGAL_DISTRIBUTION'
  | 'RELIGIOUS_PROSELYTIZING'
  | 'INAPPROPRIATE_CONTENT';

type TPostReportStatus = 'ACCEPTED' | 'REJECTED';
