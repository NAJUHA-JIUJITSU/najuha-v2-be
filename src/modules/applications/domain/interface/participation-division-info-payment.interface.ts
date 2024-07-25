import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IDivision, IDivisionModelData } from '../../../competitions/domain/interface/division.interface';
import {
  IPriceSnapshot,
  IPriceSnapshotModelData,
} from '../../../competitions/domain/interface/price-snapshot.interface';
import { IApplicationOrderPaymentSnapshot } from './application-order-payment-sanpshot.interface';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoModelData,
} from './participation-division-info.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
/**
 * ParticipationDivisionInfoPayment.
 *
 * ParticipationDivisionInfo 에 대한 결제 정보.
 */
export interface IParticipationDivisionInfoPayment {
  /** UUID v7. */
  id: TId;

  createdAt: TDateOrStringDate;

  /**
   * 결제 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  status: TParticipationDivisionInfoPaymentStatus;

  /** applicationOrderPaymentSnapshotId. */
  applicationOrderPaymentSnapshotId: IApplicationOrderPaymentSnapshot['id'];

  /** participationDivisionInfoId. */
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  /** divisionId. */
  divisionId: IDivision['id'];

  /** priceSnapshotId. */
  priceSnapshotId: IPriceSnapshot['id'];

  /** 참가정보. */
  participationDivisionInfo: IParticipationDivisionInfo;

  /** 결제된 부문 정보 */
  division: IDivision;

  /** 결제된 부문의 가격정보 */
  priceSnapshot: IPriceSnapshot;
}

// --------------------------------------------------------------
// Model Data
// --------------------------------------------------------------
export interface IParticipationDivisionInfoPaymentModelData {
  id: IParticipationDivisionInfoPayment['id'];
  createdAt: IParticipationDivisionInfoPayment['createdAt'];
  status: IParticipationDivisionInfoPayment['status'];
  applicationOrderPaymentSnapshotId: IParticipationDivisionInfoPayment['applicationOrderPaymentSnapshotId'];
  participationDivisionInfoId: IParticipationDivisionInfo['id'];
  divisionId: IDivision['id'];
  priceSnapshotId: IPriceSnapshot['id'];
  participationDivisionInfo: IParticipationDivisionInfoModelData;
  division: IDivisionModelData;
  priceSnapshot: IPriceSnapshotModelData;
}

// --------------------------------------------------------------
// ENUM
// --------------------------------------------------------------
type TParticipationDivisionInfoPaymentStatus = 'READY' | 'DONE' | 'CANCELED';
