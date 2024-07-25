import { IPost } from './post.interface';
import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser } from '../../../users/domain/interface/user.interface';
import { tags } from 'typia';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * PostReport.
 *
 * 게시글의 신고정보를 담는 Entity입니다.
 * 신고 횟수가 10회 이상이면 해당 게시글이 `INACTIVE` 상태로 변경되고, 유저에게 노출되지 않습니다.
 * 동일한 유저가 동일한 게시글을 여러 번 신고할 수 없습니다. (중복신고 불가능)
 *
 * @namespace Post
 */
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

  /**
   * 신고 상태.
   * `ACCEPTED`상태의 신고가 10회 이상이면 해당 게시글이 `INACTIVE` 상태로 변경됩니다.
   * - `ACCEPTED`: 신고 승인.
   * - `REJECTED`: 신고 거부.
   */
  status: TPostReportStatus;

  /** 신고자 UserId. */
  userId: IUser['id'];

  /** 신고된 게시글의 Id. */
  postId: IPost['id'];

  /** 신고일자. */
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
