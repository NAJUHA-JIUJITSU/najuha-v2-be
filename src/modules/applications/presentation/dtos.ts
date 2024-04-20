import {
  CreateApplicationParam,
  CreateApplicationRet,
  GetApplicationRet,
  GetExpectedPaymentRet,
  UpdateReadyApplicationRet,
  UpdateReadyApplicationParam,
  UpdateDoneApplicationParam,
} from 'src/modules/applications/application/dtos';

// Presentation Layer Request Dto ---------------------------------------------------
export interface CreateApplicationReqBody
  extends Pick<
    CreateApplicationParam,
    'competitionId' | 'participationDivisionIds' | 'playerSnapshotCreateDto' | 'applicationType'
  > {}

export interface UpdateReadyApplicationReqBody
  extends Pick<UpdateReadyApplicationParam, 'participationDivisionIds' | 'playerSnapshotUpdateDto'> {}

export interface UpdateDoneApplicationReqBody
  extends Pick<UpdateDoneApplicationParam, 'playerSnapshotUpdateDto' | 'participationDivisionInfoUpdateDtos'> {}

// Presentation Layer Response Dto ---------------------------------------------------
export interface CreateApplicationRes extends CreateApplicationRet {}

export interface GetApplicationRes extends GetApplicationRet {}

export interface GetExpectedPaymentRes extends GetExpectedPaymentRet {}

export interface UpdateReadyApplicationRes extends UpdateReadyApplicationRet {}

export interface UpdateDoneApplicationRes extends UpdateReadyApplicationRet {}
