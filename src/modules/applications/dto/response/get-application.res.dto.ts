import { IApplication } from '../../domain/structure/application.interface';
import { IParticipationDivisionSnapshot } from '../../domain/structure/participation-division-snapshot.interface';
import { IParticipationDivision } from '../../domain/structure/participation-division.interface';

interface SParticipationDivisionSnapshot {
  id: IParticipationDivisionSnapshot['id'];
  createdAt: IParticipationDivisionSnapshot['createdAt'];
  participationDivisionId: IParticipationDivisionSnapshot['participationDivisionId'];
  divisionId: IParticipationDivisionSnapshot['divisionId'];
  division: IParticipationDivisionSnapshot['division'];
}

interface SParticipationDivision {
  id: IParticipationDivision['id'];
  createdAt: IParticipationDivision['createdAt'];
  applicationId: IParticipationDivision['applicationId'];
  participationDivisionSnapshots: SParticipationDivisionSnapshot[];
}

interface SApplication {
  id: IApplication['id'];
  createdAt: IApplication['createdAt'];
  updatedAt: IApplication['updatedAt'];
  status: IApplication['status'];
  competitionId: IApplication['competitionId'];
  userId: IApplication['userId'];
  playerSnapshots: IApplication['playerSnapshots'];
  participationDivisions: SParticipationDivision[];
}

export interface GetApplicationResDto {
  application: SApplication;
}
