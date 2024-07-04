import { TMoneyValue, TPaginationParam, TPaginationRet } from '../../../common/common-types';
import { IUser } from '../../users/domain/interface/user.interface';
import { IApplicationOrder } from '../domain/interface/application-order.interface';
import {
  IApplication,
  IApplicationCreateDto,
  IApplicationDetail,
  IApplicationQueryOptions,
  IDoneApplicationUpdateDto,
} from '../domain/interface/application.interface';
import { IExpectedPayment } from '../domain/interface/expected-payment.interface';

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

// ---------------------------------------------------------------------------
// applicationsAppService Result
// ---------------------------------------------------------------------------
export interface CreateApplicationRet {
  application: IApplicationDetail;
}

export interface GetApplicationRet {
  application: IApplicationDetail;
}

export interface UpdateReadyApplicationRet {
  application: IApplicationDetail;
}

export interface UpdateDoneApplicationRet {
  application: IApplicationDetail;
}

export interface GetExpectedPaymentRet {
  expectedPayment: IExpectedPayment;
}

export interface FindApplicationsRet
  extends TPaginationRet<{
    applications: IApplicationDetail[];
  }> {}

export interface CreateApplicationOrderRet {
  application: IApplicationDetail;
}

export interface ApproveApplicationOrderRet {
  application: IApplicationDetail;
}
