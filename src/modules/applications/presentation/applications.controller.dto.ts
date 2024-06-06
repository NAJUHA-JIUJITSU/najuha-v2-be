import {
  CreateApplicationRet,
  FindApplicationsRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateReadyApplicationRet,
} from 'src/modules/applications/application/applications.app.dto';
import {
  IApplicationCreateDto,
  IApplicationQueryOptions,
  IDoneApplicationUpdateDto,
} from '../domain/interface/application.interface';
import { TPaginationParam } from 'src/common/common-types';

// ---------------------------------------------------------------------------
// applicationsController Request
// ---------------------------------------------------------------------------

export interface CreateApplicationReqBody extends Omit<IApplicationCreateDto, 'userId'> {}

export interface UpdateReadyApplicationReqBody extends Omit<IApplicationCreateDto, 'userId'> {}

export interface UpdateDoneApplicationReqBody extends IDoneApplicationUpdateDto {}

export interface FindApplicationsQuery extends Partial<TPaginationParam<Omit<IApplicationQueryOptions, 'userId'>>> {}

// ---------------------------------------------------------------------------
// applicationsController Response
// ---------------------------------------------------------------------------
export interface CreateApplicationRes extends CreateApplicationRet {}

export interface GetApplicationRes extends GetApplicationRet {}

export interface GetExpectedPaymentRes extends GetExpectedPaymentRet {}

export interface UpdateReadyApplicationRes extends UpdateReadyApplicationRet {}

export interface UpdateDoneApplicationRes extends UpdateReadyApplicationRet {}

export interface FindApplicationsRes extends FindApplicationsRet {}
