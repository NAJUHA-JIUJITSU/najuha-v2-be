import {
  CreateApplicationRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateReadyApplicationRet,
} from 'src/modules/applications/application/dtos';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IApplication } from '../domain/interface/application.interface';
import { IPlayerSnapshotCreateDto } from '../domain/interface/player-snapshot.interface';
import { IAdditionalInfoCreateDto, IAdditionalInfoUpdateDto } from '../domain/interface/additional-info.interface';
import { IParticipationDivisionInfoUpdateDto } from '../domain/interface/participation-division-info.interface';

// Presentation Layer Request Dto ---------------------------------------------------

export interface CreateApplicationReqBody {
  competitionId: ICompetition['id'];
  /**
   * - Division IDs to participate.
   * @minItems 1
   */
  participationDivisionIds: IDivision['id'][];
  applicationType: IApplication['type'];
  playerSnapshotCreateDto: IPlayerSnapshotCreateDto;
  additionalInfoCreateDtos?: IAdditionalInfoCreateDto[];
}

export interface UpdateReadyApplicationReqBody {
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

// Presentation Layer Response Dto ---------------------------------------------------

export interface CreateApplicationRes extends CreateApplicationRet {}

export interface GetApplicationRes extends GetApplicationRet {}

export interface GetExpectedPaymentRes extends GetExpectedPaymentRet {}

export interface UpdateReadyApplicationRes extends UpdateReadyApplicationRet {}

export interface UpdateDoneApplicationRes extends UpdateReadyApplicationRet {}
