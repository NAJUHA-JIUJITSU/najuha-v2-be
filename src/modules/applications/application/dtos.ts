import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IApplication } from '../domain/interface/application.interface';
import { IExpectedPayment } from '../domain/interface/expected-payment.interface';
import { IParticipationDivisionInfo } from '../domain/interface/participation-division-info.interface';
import { IPlayerSnapshot } from '../domain/interface/player-snapshot.interface';

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
  playerSnapshotCreateDto: IPlayerSnapshot.Dto.Create;
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
  playerSnapshotUpdateDto: IPlayerSnapshot.Dto.Create;
}

export interface UpdateDoneApplicationParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
  playerSnapshotUpdateDto?: IPlayerSnapshot.Dto.Create;
  /**
   * - Division info update data list.
   * @minItems 1
   */
  participationDivisionInfoUpdateDtos?: IParticipationDivisionInfo.Dto.Update[];
}

export interface GetExpectedPaymentParam {
  userId: IUser['id'];
  applicationId: IApplication['id'];
}

// Application Layer Result DTOs -----------------------------------------------------
export interface CreateApplicationRet {
  application: IApplication.Entity.Ready;
}

export interface GetApplicationRet {
  application: IApplication.Entity.Ready | IApplication.Entity.Done;
}

export interface UpdateReadyApplicationRet {
  application: IApplication.Entity.Ready;
}

export interface UpdateDoneApplicationRet {
  application: IApplication.Entity.Done;
}

export interface GetExpectedPaymentRet {
  expectedPayment: IExpectedPayment;
}
