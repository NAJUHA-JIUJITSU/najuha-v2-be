import { IDivision } from './division.interface';

export interface ICombinationUnit {
  /** Uniform Type (Gi or NOGI). */
  uniformType: IDivision['uniform'];

  /** Weight Type (WEIGHT or ABSOLUTE). */
  weightType: 'WEIGHT' | 'ABSOLUTE';
}

export interface ICombinationDiscountRule {
  /**
   * 할인 조합.
   * - ICombinationUnit들의 조합을 만족하는경우 할인금액을 적용한다.
   */
  combination: ICombinationUnit[];

  /** 할인금액. */
  discountAmount: number;
}
