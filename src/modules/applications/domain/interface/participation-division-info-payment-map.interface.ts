import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IApplicationPaymentSnapshot } from './application-payment-sanpshot.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
export interface IParticipationDivisionInfoPaymentMap {
  id: TId;

  createdAt: TDateOrStringDate;

  applicationPaymentSnapshotId: IApplicationPaymentSnapshot['id'];

  participationDivisionInfoId: IParticipationDivisionInfo['id'];
}

// --------------------------------------------------------------
// Model Data
// --------------------------------------------------------------
export interface IParticipationDivisionInfoPaymentMapModelData {
  id: IParticipationDivisionInfoPaymentMap['id'];
  createdAt: IParticipationDivisionInfoPaymentMap['createdAt'];
  applicationPaymentSnapshotId: IParticipationDivisionInfoPaymentMap['applicationPaymentSnapshotId'];
  participationDivisionInfoId: IParticipationDivisionInfo['id'];
}
