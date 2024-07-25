import { IDivision, IDivisionModelData } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * ParticipationDivisionInfoSnapshot.
 *
 * 참가신청에 대한 부문 정보.
 * - 참가신청에 대한 부문 정보가 변경경될때마다 스냅샷을 생성한다.
 * - 결제 이후에만 스냅샷이 저장되고, 결제 이전에 참가 부문 수정시, Application자체를 새로 생성한다.
 * - 해당 entity 를 포함하는 Application이 DONE 상태라면, 최초의 스냅샷이 결제정보로 사용된다.
 * - 마지막 스냅샷이 현제의 참가 부문 정보를 나타낸다.
 */
export interface IParticipationDivisionInfoSnapshot {
  /** UUID v7. */
  id: TId;

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
