import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IApplication } from '../domain/interface/application.interface';
import { IExpectedPayment } from '../domain/interface/expected-payment.interface';
import { IPlayerSnapshot } from '../domain/interface/player-snapshot.interface';
import { IParticipationDivisionInfo } from '../domain/interface/participation-division-info.interface';

// Application Layer Param DTOs ---------------------------------------------------
export interface CreateApplicationParam {
  userId: IUser['id'];
  competitionId: ICompetition['id'];
  /**
   * - Division IDs to participate.
   * @minItems 1
   */
  participationDivisionIds: IDivision['id'][];
  applicationType: IApplication['type'];
  createPlayerSnapshotDto: IPlayerSnapshot.CreateDto;
}

export interface GetApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

export interface UpdateReadyApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  /**
   * - Division IDs to participate.
   * @minItems 1
   */
  participationDivisionIds: IDivision['id'][];
  updatePlayerSnapshotDto: IPlayerSnapshot.CreateDto;
}

export interface UpdateDoneApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  updatePlayerSnapshotDto?: IPlayerSnapshot.CreateDto;
  /**
   * - Division info update data list.
   * @minItems 1
   */
  updateParticipationDivisionInfoDtos?: IParticipationDivisionInfo.UpdateDto[];
}

export interface GetExpectedPaymentParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

// Application Layer Result DTOs -----------------------------------------------------
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
