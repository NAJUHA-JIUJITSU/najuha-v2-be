import { TMoneyValue, TPaginationParam, TPaginationRet } from '../../../common/common-types';
import { IUser } from '../../users/domain/interface/user.interface';
import { IApplicationOrder } from '../domain/interface/application-order.interface';
import {
  IApplication,
  IApplicationCreateDto,
  IApplicationQueryOptions,
  IDoneApplicationUpdateDto,
} from '../domain/interface/application.interface';
import { IExpectedPayment } from '../domain/interface/expected-payment.interface';
import { IParticipationDivisionInfo } from '../domain/interface/participation-division-info.interface';

// ---------------------------------------------------------------------------
// applicationsAppService Param
// ---------------------------------------------------------------------------
export interface CreateApplicationParam {
  applicationCreateDto: IApplicationCreateDto;
}

export interface FindApplicationsParam extends TPaginationParam<IApplicationQueryOptions> {}

export interface GetApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

export interface UpdateReadyApplicationParam {
  applicationId: IApplication['id'];
  applicationCreateDto: IApplicationCreateDto;
}

export interface UpdateDoneApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  doneApplicationUpdateDto: IDoneApplicationUpdateDto;
}

export interface GetExpectedPaymentParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

export interface CreateApplicationOrderParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

export interface ApproveApplicationOrderParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  paymentKey: string;
  orderId: IApplicationOrder['orderId'];
  amount: TMoneyValue;
}

export interface CancelApplicationOrderParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  participationDivisionInfoIds: IParticipationDivisionInfo['id'][];
}

// ---------------------------------------------------------------------------
// applicationsAppService Result
// ---------------------------------------------------------------------------
export interface CreateApplicationRet {
  application: IApplication;
}

export interface GetApplicationRet {
  application: IApplication;
}

export interface UpdateReadyApplicationRet {
  application: IApplication;
}

export interface UpdateDoneApplicationRet {
  application: IApplication;
}

export interface GetExpectedPaymentRet {
  expectedPayment: IExpectedPayment;
}

export interface FindApplicationsRet
  extends TPaginationRet<{
    applications: IApplication[];
  }> {}

export interface CreateApplicationOrderRet {
  application: IApplication;
}

export interface ApproveApplicationOrderRet {
  application: IApplication;
}

export interface CancelApplicationOrderRet {
  application: IApplication;
}
