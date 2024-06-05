import { tags } from 'typia';
import { ICombinationDiscountRule } from './combination-discount-rule.interface';
import { ICompetition } from './competition.interface';
import { TId, TDateOrStringDate } from 'src/common/common-types';

export interface ICombinationDiscountSnapshot {
  /** UUID v7. */
  id: TId;

  /** 조합 할인 규칙. */
  combinationDiscountRules: ICombinationDiscountRule[] & tags.MinItems<1>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

export interface ICombinationDiscountSnapshotCreateDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules' | 'competitionId'> {}
