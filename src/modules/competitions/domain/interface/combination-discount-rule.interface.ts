import { IDivision } from './division.interface';

/**
 * 조합의 단위.
 *
 * - gi & weight
 * - gi & absolute
 * - nogi & weight
 * - nogi & absolute
 */
export interface ICombinationUnit {
  /** Uniform Type (Gi or NOGI). */
  uniformType: IDivision['uniform'];

  /** Weight Type (WEIGHT or ABSOLUTE). */
  weightType: 'WEIGHT' | 'ABSOLUTE';
}

/**
 * 조합할인 규칙.
 *
 * - 조합할인 규칙은 ICombinationUnit들의 조합을 만족하는경우 할인금액을 적용한다.
 *
 * - example CombinationDiscountRule
 * {
 *  combination: [
 *   { uniformType: 'GI', weightType: 'WEIGHT' },
 *   { uniformType: 'GI', weightType: 'ABSOLUTE' },
 *  ],
 *  discountAmount: 10000,
 * },
 */
export interface ICombinationDiscountRule {
  /**
   * 할인 조합.
   * - ICombinationUnit들의 조합을 만족하는경우 할인금액을 적용한다.
   */
  combination: ICombinationUnit[];

  /** 할인금액. */
  discountAmount: number;
}
