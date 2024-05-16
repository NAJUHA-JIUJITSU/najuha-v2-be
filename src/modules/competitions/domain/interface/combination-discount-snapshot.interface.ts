import { tags } from 'typia';
import { ICombinationDiscountRule } from './combination-discount-rule.interface';
import { ICompetition } from './competition.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface ICombinationDiscountSnapshot {
  /** UUIDv7. */
  id: string & tags.MinLength<36> & tags.MaxLength<36>;

  /** 조합 할인 규칙. */
  combinationDiscountRules: ICombinationDiscountRule[] & tags.MinItems<1>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

export interface ICombinationDiscountSnapshotCreateDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules' | 'competitionId'> {}
