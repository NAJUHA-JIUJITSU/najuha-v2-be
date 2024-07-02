import { IDivision, IDivisionModelData } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfoSnapshot {
  /** UUID v7. */
  id: TId;

  /** CreatedAt */
  createdAt: TDateOrStringDate;

  /** - Participation division Info id. */
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  /** - Division id (참가한 부문 id). */
  divisionId: IDivision['id'];

  /** - Division. (참가한 부문).*/
  division: IDivision;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IParticipationDivisionInfoSnapshotModelData {
  id: IParticipationDivisionInfoSnapshot['id'];
  createdAt: IParticipationDivisionInfoSnapshot['createdAt'];
  participationDivisionInfoId: IParticipationDivisionInfo['id'];
  divisionId: IDivision['id'];
  division: IDivisionModelData;
}
