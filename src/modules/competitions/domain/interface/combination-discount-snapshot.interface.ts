import { tags } from 'typia';
import { ICombinationDiscountRule } from './combination-discount-rule.interface';
import { ICompetition } from './competition.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface ICombinationDiscountSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** 조합 할인 규칙. */
  combinationDiscountRules: ICombinationDiscountRule[] & tags.MinItems<1>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

export interface ICombinationDiscountSnapshotCreateDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules' | 'competitionId'> {}
