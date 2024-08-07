import { ICompetition } from './competition.interface';
import { TId, TDateOrStringDate, TMoneyValue } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * EarlybirdDiscountSnapshot.
 *
 * 얼리버드 할인 스냅샷.
 * - 얼리버드 할인 규칙이 변경될때마다 스냅샷을 생성한다.
 */
export interface IEarlybirdDiscountSnapshot {
  /**  UUID v7. */
  id: TId;

  /** 얼리버드 할인 시작일. */
  earlybirdStartDate: TDateOrStringDate;

  /** 얼리버드 할인 마감일. */
  earlybirdEndDate: TDateOrStringDate;

  /**
   * 얼리버드 할인 가격.
   * - ex) 10000.
   * - 단위 : 원.
   * - 음수 값은 허용하지 않습니다.
   */
  discountAmount: TMoneyValue;

  /** createdAt. */
  createdAt: TDateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IEarlybirdDiscountSnapshotModelData extends IEarlybirdDiscountSnapshot {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IEarlybirdDiscountSnapshotCreateDto
  extends Pick<
    IEarlybirdDiscountSnapshot,
    'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount' | 'competitionId'
  > {}
