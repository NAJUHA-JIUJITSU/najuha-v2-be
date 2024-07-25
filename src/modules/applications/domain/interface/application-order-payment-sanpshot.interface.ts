import { TMoneyValue, TDateOrStringDate, TId } from '../../../../common/common-types';
import { IApplicationOrder } from './application-order.interface';
import {
  IParticipationDivisionInfoPayment,
  IParticipationDivisionInfoPaymentModelData,
} from './participation-division-info-payment.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
/**
 * ApplicationOrderPaymentSnapshot.
 *
 * 참가신청에 대한 결제 정보.
 */
export interface IApplicationOrderPaymentSnapshot {
  /** UUID v7. */
  id: TId;

  createdAt: TDateOrStringDate;

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

  /** - application id. */
  applicationOrderId: IApplicationOrder['id'];

  participationDivisionInfoPayments: IParticipationDivisionInfoPayment[];
}

// --------------------------------------------------------------
// Model Data Interface
// --------------------------------------------------------------
export interface IApplicationOrderPaymentSnapshotModelData {
  id: IApplicationOrderPaymentSnapshot['id'];
  createdAt: IApplicationOrderPaymentSnapshot['createdAt'];
  normalAmount: IApplicationOrderPaymentSnapshot['normalAmount'];
  earlybirdDiscountAmount: IApplicationOrderPaymentSnapshot['earlybirdDiscountAmount'];
  combinationDiscountAmount: IApplicationOrderPaymentSnapshot['combinationDiscountAmount'];
  totalAmount: IApplicationOrderPaymentSnapshot['totalAmount'];
  applicationOrderId: IApplicationOrderPaymentSnapshot['applicationOrderId'];
  participationDivisionInfoPayments: IParticipationDivisionInfoPaymentModelData[];
}
