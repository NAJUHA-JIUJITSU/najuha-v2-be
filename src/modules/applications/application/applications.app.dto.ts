import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  IApplication,
  IApplicationCreateDto,
  IDoneApplicationUpdateDto,
} from '../domain/interface/application.interface';
import { IExpectedPayment } from '../domain/interface/expected-payment.interface';

// ---------------------------------------------------------------------------
// applicationsAppService Param
// ---------------------------------------------------------------------------
export interface CreateApplicationParam {
  applicationCreateDto: IApplicationCreateDto;
}

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

export interface FindApplicationsParam {
  userId: IUser['id'];
  page: number;
  limit: number;
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

export interface FindApplicationsRet {
  applications: IApplication[];
  nextPage?: number;
}
