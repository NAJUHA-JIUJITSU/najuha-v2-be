import { tags } from 'typia';
import { ICombinationDiscountRule } from './combination-discount-rule.interface';
import { ICompetition } from './competition.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * CombinationDiscountSnapshot.
 *
 * 부문 조합 할인 스냅샷.
 * - 조합 할인 규칙이 변경될때마다 스냅샷을 생성한다.
 */
export interface ICombinationDiscountSnapshot {
  /** UUID v7. */
  id: TId;

  /** 조합 할인 규칙. */
  combinationDiscountRules: ICombinationDiscountRule[] & tags.MinItems<1>;

  /** createdAt. */
  createdAt: TDateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICombinationDiscountSnapshotModelData extends ICombinationDiscountSnapshot {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ICombinationDiscountSnapshotCreateDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules' | 'competitionId'> {}
