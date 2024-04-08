import { ICombinationDiscountRule } from './combination-discount-rule.interface';
import { ICompetition } from './competition.interface';

export interface ICombinationDiscountSnapshot {
  /**
   * - combination discount snapshot id.
   * @type uint32
   */
  id: number;

  combinationDiscountRules: ICombinationDiscountRule[];

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  createdAt: Date | string;

  /** - competition id. */
  competitionId: ICompetition['id'];
}
