import { TMoneyValue } from '../../../../common/common-types';

/**
 * ExpectedPayment.
 *
 * - READY 상태의 Application의 예상 결제 정보.
 * - 결제이후에는 사요되지 않습니다.
 */
export interface IExpectedPayment {
  /** 할인이 적용되지 않은 총 금액 (원). */
  normalAmount: TMoneyValue;

  /** 얼리버드 할인 규칙에의해 할인된 금액. (원). */
  earlybirdDiscountAmount: TMoneyValue;

  /** 조합할인 규칙에의해 할인된 금액. (원). */
  combinationDiscountAmount: TMoneyValue;

  /**
   * 할인이 적용된 최종금액. (원).
   * - 계산 방법 : normalAmount - earlybirdDiscountAmount - combinationDiscountAmount.
   */
  totalAmount: TMoneyValue;
}
