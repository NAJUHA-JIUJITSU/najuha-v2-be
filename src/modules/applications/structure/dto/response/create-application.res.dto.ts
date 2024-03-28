import { IApplication } from '../../interface/application.interface';
import { IPlayerSnapshot } from '../../interface/player-snapshot.interface';
import { IParticipationDivision } from '../../interface/participation-division.interface';
import { IParticipationDivisionSnapshot } from '../../interface/participation-division-snapshot.interface';

interface ParticipationDivisionSnapshotInReadyStatus {
  id: IParticipationDivisionSnapshot['id'];
  createdAt: IParticipationDivisionSnapshot['createdAt'];
  participationDivisionId: IParticipationDivisionSnapshot['participationDivisionId'];
  divisionId: IParticipationDivisionSnapshot['divisionId'];
}

interface ParticipationDivisionInReadyStatus {
  id: IParticipationDivision['id'];
  createdAt: IParticipationDivision['createdAt'];
  applicationId: IParticipationDivision['applicationId'];
  participationDivisionSnapshots: ParticipationDivisionSnapshotInReadyStatus[];
}

interface ApplicationInReadyStatus {
  id: IApplication['id'];
  competitionId: IApplication['competitionId'];
  createdAt: IApplication['createdAt'];
  updatedAt: IApplication['updatedAt'];
  status: IApplication['status'];
  playerSnapshots: IPlayerSnapshot[];
  participationDivisions: ParticipationDivisionInReadyStatus[];
}

export interface CreateApplicationInReadyStatusResDto {
  application: ApplicationInReadyStatus;
}
