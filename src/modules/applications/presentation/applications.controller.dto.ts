import {
  ApproveApplicationOrderRet,
  CancelApplicationOrderRet,
  CreateApplicationOrderRet,
  CreateApplicationRet,
  FindApplicationsRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateReadyApplicationRet,
} from '../application/applications.app.dto';
import {
  IApplicationCreateDto,
  IApplicationQueryOptions,
  IDoneApplicationUpdateDto,
} from '../domain/interface/application.interface';
import { TPaginationParam } from '../../../common/common-types';
import { IParticipationDivisionInfo } from '../domain/interface/participation-division-info.interface';

// ---------------------------------------------------------------------------
// applicationsController Request
// ---------------------------------------------------------------------------

export interface CreateApplicationReqBody extends Omit<IApplicationCreateDto, 'userId'> {}

export interface UpdateReadyApplicationReqBody extends Omit<IApplicationCreateDto, 'userId'> {}

export interface UpdateDoneApplicationReqBody extends IDoneApplicationUpdateDto {}

export interface FindApplicationsQuery extends Partial<TPaginationParam<Omit<IApplicationQueryOptions, 'userId'>>> {}

export interface ApproveApplicationOrderReqBody {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface CancelApplicationOrderReqBody {
  participationDivisionInfoIds: IParticipationDivisionInfo['id'][];
}

// ---------------------------------------------------------------------------
// applicationsController Response
// ---------------------------------------------------------------------------
export interface CreateApplicationRes extends CreateApplicationRet {}

export interface GetApplicationRes extends GetApplicationRet {}

export interface GetExpectedPaymentRes extends GetExpectedPaymentRet {}

export interface UpdateReadyApplicationRes extends UpdateReadyApplicationRet {}

export interface UpdateDoneApplicationRes extends UpdateReadyApplicationRet {}

export interface FindApplicationsRes extends FindApplicationsRet {}

export interface CreateApplicationOrderRes extends CreateApplicationOrderRet {}

export interface ApproveApplicationOrderRes extends ApproveApplicationOrderRet {}

export interface CancelApplicationOrderRes extends CancelApplicationOrderRet {}
