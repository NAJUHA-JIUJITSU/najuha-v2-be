import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IApplication } from './application.interface';
import {
  IParticipationDivisionInfoSnapshot,
  IParticipationDivisionInfoSnapshotModelData,
} from './participation-division-info-snapshot.interface';
import { tags } from 'typia';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfo {
  /** UUID v7. */
  id: TId;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  status: TParticipationDivisionInfoStatus;

  /** Application id. */
  applicationId: IApplication['id'];

  /** 참가부문 정보 스냅샷. */
  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshot[] & tags.MinItems<1>;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfoModelData
  extends Pick<IParticipationDivisionInfo, 'id' | 'createdAt' | 'status' | 'applicationId'> {
  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshotModelData[];
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

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
export type TParticipationDivisionInfoStatus = 'READY' | 'DONE' | 'CANCELED';
