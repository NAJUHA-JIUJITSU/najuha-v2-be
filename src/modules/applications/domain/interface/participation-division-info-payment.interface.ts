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
export interface IParticipationDivisionInfoPayment {
  id: TId;

  createdAt: TDateOrStringDate;

  status: TParticipationDivisionInfoPaymentStatus;

  applicationOrderPaymentSnapshotId: IApplicationOrderPaymentSnapshot['id'];

  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  divisionId: IDivision['id'];

  priceSnapshotId: IPriceSnapshot['id'];

  participationDivisionInfo: IParticipationDivisionInfo;

  division: IDivision;

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
