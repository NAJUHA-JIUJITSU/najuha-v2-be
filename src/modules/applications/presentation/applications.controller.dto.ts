import {
  CreateApplicationRet,
  FindApplicationsRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateReadyApplicationRet,
} from 'src/modules/applications/application/applications.app.dto';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import {
  IApplication,
  IApplicationCreateDto,
  IApplicationQueryOptions,
  IDoneApplicationUpdateDto,
} from '../domain/interface/application.interface';
import { IPlayerSnapshotCreateDto } from '../domain/interface/player-snapshot.interface';
import { IAdditionalInfoCreateDto, IAdditionalInfoUpdateDto } from '../domain/interface/additional-info.interface';
import { IParticipationDivisionInfoUpdateDto } from '../domain/interface/participation-division-info.interface';

// ---------------------------------------------------------------------------
// applicationsController Request
// ---------------------------------------------------------------------------

export interface CreateApplicationReqBody extends Omit<IApplicationCreateDto, 'userId'> {}

export interface UpdateReadyApplicationReqBody extends Omit<IApplicationCreateDto, 'userId'> {}

export interface UpdateDoneApplicationReqBody extends IDoneApplicationUpdateDto {}

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
