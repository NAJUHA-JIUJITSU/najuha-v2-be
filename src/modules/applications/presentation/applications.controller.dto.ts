import {
  CreateApplicationRet,
  FindApplicationsRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateReadyApplicationRet,
} from 'src/modules/applications/application/applications.app.dto';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IApplication, IApplicationQueryOptions } from '../domain/interface/application.interface';
import { IPlayerSnapshotCreateDto } from '../domain/interface/player-snapshot.interface';
import { IAdditionalInfoCreateDto, IAdditionalInfoUpdateDto } from '../domain/interface/additional-info.interface';
import { IParticipationDivisionInfoUpdateDto } from '../domain/interface/participation-division-info.interface';

// ---------------------------------------------------------------------------
// applicationsController Request
// ---------------------------------------------------------------------------
export interface CreateApplicationReqBody {
  applicationType: IApplication['type'];
  competitionId: ICompetition['id'];
  /**
   * - Division IDs to participate.
   * @minItems 1
   */
  participationDivisionIds: IDivision['id'][];
  playerSnapshotCreateDto: IPlayerSnapshotCreateDto;
  additionalInfoCreateDtos?: IAdditionalInfoCreateDto[];
}

export interface UpdateReadyApplicationReqBody {
  applicationType: IApplication['type'];
  /**
   * - Division IDs to participate.
   * @minItems 1
   */
  participationDivisionIds: IDivision['id'][];
  playerSnapshotUpdateDto: IPlayerSnapshotCreateDto;
  additionalInfoCreateDtos?: IAdditionalInfoCreateDto[];
}

export interface UpdateDoneApplicationReqBody {
  /**
   * - Division info update data list.
   * @minItems 1
   */
  participationDivisionInfoUpdateDtos?: IParticipationDivisionInfoUpdateDto[];
  playerSnapshotUpdateDto?: IPlayerSnapshotCreateDto;
  additionalInfoUpdateDtos?: IAdditionalInfoUpdateDto[];
}

export interface FindApplicationsQuery extends Pick<IApplicationQueryOptions, 'page' | 'limit'> {}

// ---------------------------------------------------------------------------
// applicationsController Response
// ---------------------------------------------------------------------------
export interface CreateApplicationRes extends CreateApplicationRet {}

export interface GetApplicationRes extends GetApplicationRet {}

export interface GetExpectedPaymentRes extends GetExpectedPaymentRet {}

export interface UpdateReadyApplicationRes extends UpdateReadyApplicationRet {}

export interface UpdateDoneApplicationRes extends UpdateReadyApplicationRet {}

export interface FindApplicationsRes extends FindApplicationsRet {}
