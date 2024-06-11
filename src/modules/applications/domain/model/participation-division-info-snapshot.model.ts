import { IParticipationDivisionInfoSnapshot } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { DivisionModel } from '../../../competitions/domain/model/division.model';

export class ParticipationDivisionInfoSnapshotModel {
  public readonly id: IParticipationDivisionInfoSnapshot['id'];
  public readonly createdAt: IParticipationDivisionInfoSnapshot['createdAt'];
  public readonly participationDivisionInfoId: IParticipationDivisionInfo['id'];
  public readonly participationDivisionId: IDivision['id'];
  public readonly division: DivisionModel;

  constructor(entity: IParticipationDivisionInfoSnapshot) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.participationDivisionInfoId = entity.participationDivisionInfoId;
    this.participationDivisionId = entity.participationDivisionId;
    this.division = new DivisionModel(entity.division);
  }

  toEntity(): IParticipationDivisionInfoSnapshot {
    return {
      id: this.id,
      createdAt: this.createdAt,
      participationDivisionInfoId: this.participationDivisionInfoId,
      participationDivisionId: this.participationDivisionId,
      division: this.division,
    };
  }
}
