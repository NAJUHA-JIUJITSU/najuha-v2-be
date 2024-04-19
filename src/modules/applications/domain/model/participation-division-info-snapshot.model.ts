import { IParticipationDivisionInfoSnapshot } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';

export class ParticipationDivisionInfoSnapshotModel {
  public readonly id: IParticipationDivisionInfoSnapshot['id'];
  public readonly createdAt: IParticipationDivisionInfoSnapshot['createdAt'];
  public readonly participationDivisionInfoId: IParticipationDivisionInfo['id'];
  public readonly participationDivisionId: IDivision['id'];
  public readonly division: IDivision;

  constructor(props: IParticipationDivisionInfoSnapshot) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.participationDivisionInfoId = props.participationDivisionInfoId;
    this.participationDivisionId = props.participationDivisionId;
    this.division = props.division;
  }

  toValue(): IParticipationDivisionInfoSnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt,
      participationDivisionInfoId: this.participationDivisionInfoId,
      participationDivisionId: this.participationDivisionId,
      division: this.division,
    };
  }
}
