import { TMoney, TDateOrStringDate, TId } from '../../../../common/common-types';
import { IApplicationPayment } from './application-payment.interface';
import {
  IParticipationDivisionInfoPaymentMap,
  IParticipationDivisionInfoPaymentMapModelData,
} from './participation-division-info-payment-map.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
export interface IApplicationPaymentSnapshot {
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
  applicationPaymentId: IApplicationPayment['id'];

  participationDivisionInfoPaymentMaps: IParticipationDivisionInfoPaymentMap;
}

export interface IApplicationPaymentSnapshotModelData {
  id: IApplicationPaymentSnapshot['id'];
  createdAt: IApplicationPaymentSnapshot['createdAt'];
  normalAmount: IApplicationPaymentSnapshot['normalAmount'];
  earlybirdDiscountAmount: IApplicationPaymentSnapshot['earlybirdDiscountAmount'];
  combinationDiscountAmount: IApplicationPaymentSnapshot['combinationDiscountAmount'];
  totalAmount: IApplicationPaymentSnapshot['totalAmount'];
  applicationPaymentId: IApplicationPaymentSnapshot['applicationPaymentId'];
  participationDivisionInfoPaymentMaps: IParticipationDivisionInfoPaymentMapModelData[];
}
