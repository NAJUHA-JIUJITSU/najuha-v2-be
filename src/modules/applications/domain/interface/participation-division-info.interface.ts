import { IDivision, IDivisionModelData } from '../../../competitions/domain/interface/division.interface';
import { IApplication } from './application.interface';
import {
  IParticipationDivisionInfoSnapshot,
  IParticipationDivisionInfoSnapshotModelData,
} from './participation-division-info-snapshot.interface';
import { tags } from 'typia';
import { TId, TDateOrStringDate } from '../../../../common/common-types';
import {
  IPriceSnapshot,
  IPriceSnapshotModelData,
} from '../../../competitions/domain/interface/price-snapshot.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfo {
  /** UUID v7. */
  id: TId;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  status: 'READY' | 'DONE' | 'CANCELED';

  /** Application id. */
  applicationId: IApplication['id'];

  payedDivisionId: IDivision['id'] | null;

  payedPriceSnapshotId: IPriceSnapshot['id'] | null;

  /** 참가부문 정보 스냅샷. */
  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshot[] & tags.MinItems<1>;

  payedDivision: IDivision | null;

  payedPriceSnapshot: IParticipationDivisionInfoSnapshot | null;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfoModelData {
  id: IParticipationDivisionInfo['id'];
  createdAt: IParticipationDivisionInfo['createdAt'];
  applicationId: IParticipationDivisionInfo['id'];
  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshotModelData[];
  payedDivisionId: IParticipationDivisionInfo['payedDivisionId'];
  payedPriceSnapshotId: IParticipationDivisionInfo['payedPriceSnapshotId'];
  payedDivision: IDivisionModelData | null;
  payedPriceSnapshot: IPriceSnapshotModelData | null;
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfoUpdateDto {
  /** 수정하고자 하는 참가부문 정보 ID (식별자). */
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  /** 새로 참가 하고자 하는 부문 ID. */
  newParticipationDivisionId: IDivision['id'];
}
