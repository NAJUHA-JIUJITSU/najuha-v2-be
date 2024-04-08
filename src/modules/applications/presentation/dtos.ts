import {
  CreateApplicationParam,
  CreateApplicationRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateApplicationParam,
  UpdateApplicationRet,
} from 'src/modules/applications/application/dtos';

// Presentation Layer Request Dto ---------------------------------------------------
export interface CreateApplicationReqBody
  extends Pick<CreateApplicationParam, 'competitionId' | 'divisionIds' | 'player'> {}

export interface UpdateApplicationReqBody extends Pick<UpdateApplicationParam, 'divisionIds' | 'player'> {}

// Presentation Layer Response Dto ---------------------------------------------------
export interface CreateApplicationRes extends CreateApplicationRet {}

export interface GetApplicationRes extends GetApplicationRet {}

export interface GetExpectedPaymentRes extends GetExpectedPaymentRet {}

export interface UpdateApplicationRes extends UpdateApplicationRet {}
