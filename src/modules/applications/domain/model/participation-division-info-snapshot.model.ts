import { IParticipationDivisionInfoSnapshot } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';

export class ParticipationDivisionInfoSnapshotModel {
  public readonly id: IParticipationDivisionInfoSnapshot['id'];
  public readonly createdAt: IParticipationDivisionInfoSnapshot['createdAt'];
  public readonly participationDivisionInfoId: IParticipationDivisionInfo['id'];
  public readonly participationDivisionId: IDivision['id'];
  public readonly division: IDivision;

  constructor(participationDivisionInfoSnapshot: IParticipationDivisionInfoSnapshot) {
    this.id = participationDivisionInfoSnapshot.id;
    this.createdAt = participationDivisionInfoSnapshot.createdAt;
    this.participationDivisionInfoId = participationDivisionInfoSnapshot.participationDivisionInfoId;
    this.participationDivisionId = participationDivisionInfoSnapshot.participationDivisionId;
    this.division = participationDivisionInfoSnapshot.division;
  }
}
