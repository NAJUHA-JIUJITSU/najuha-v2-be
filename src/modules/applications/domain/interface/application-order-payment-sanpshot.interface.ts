import { tags } from 'typia';
import { TMoney, TDateOrStringDate, TId } from '../../../../common/common-types';
import { IApplicationOrder } from './application-order.interface';
import {
  IParticipationDivisionInfoPayment,
  IParticipationDivisionInfoPaymentDetail,
  IParticipationDivisionInfoPaymentModelData,
} from './participation-division-info-payment.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
export interface IApplicationOrderPaymentSnapshot {
  /** UUID v7. */
  id: TId;

  /** CreatedAt */
  createdAt: TDateOrStringDate;

  /** 할인이 적용되지 않은 총 금액 (원). */
  normalAmount: TMoney;

  /** Earlybird discount amount. (원). */
  earlybirdDiscountAmount: TMoney;

  /** Combination discount amount. (원). */
  combinationDiscountAmount: TMoney;

  /**
   * Total amount 할인이 적용된 최종금액. (원).
   * - 계산 방법 : normalAmount - earlybirdDiscountAmount - combinationDiscountAmount.
   */
  totalAmount: TMoney;

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

// --------------------------------------------------------------
// Return Interface
// --------------------------------------------------------------
export interface IApplicationOrderPaymentSnapshotDetail
  extends Pick<
    IApplicationOrderPaymentSnapshot,
    | 'id'
    | 'createdAt'
    | 'normalAmount'
    | 'earlybirdDiscountAmount'
    | 'combinationDiscountAmount'
    | 'totalAmount'
    | 'applicationOrderId'
  > {
  participationDivisionInfoPayments: IParticipationDivisionInfoPaymentDetail[];
}
