import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IApplication } from '../domain/interface/application.interface';
import { IExpectedPayment } from '../domain/interface/expected-payment.interface';

// Application Layer Param DTOs ---------------------------------------------------
export interface CreateApplicationParam {
  userId: IUser['id'];
  competitionId: ICompetition['id'];
  divisionIds: IDivision['id'][];
  player: IApplication.Create.Player;
}

export interface GetApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

export interface UpdateReadyApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  divisionIds: IDivision['id'][];
  player: IApplication.UpdateReadyApplication.Player;
}

export interface GetExpectedPaymentParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

// Application Layer Result DTOs -----------------------------------------------------
export interface CreateApplicationRet {
  application: IApplication.Create.Application;
}

// TODO
export interface GetApplicationRet {
  application: IApplication.Get.Application;
}

// TODO
export interface UpdateApplicationRet {
  application: IApplication.UpdateReadyApplication.Application;
}

export interface GetExpectedPaymentRet {
  expectedPayment: IExpectedPayment;
}
