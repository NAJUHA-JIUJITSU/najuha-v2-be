import { IParticipationDivisionInfoSnapshotModelData } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { DivisionModel } from '../../../competitions/domain/model/division.model';

export class ParticipationDivisionInfoSnapshotModel {
  public readonly id: IParticipationDivisionInfoSnapshotModelData['id'];
  public readonly createdAt: IParticipationDivisionInfoSnapshotModelData['createdAt'];
  public readonly participationDivisionInfoId: IParticipationDivisionInfo['id'];
  public readonly participationDivisionId: IDivision['id'];
  public readonly division: DivisionModel;

  constructor(entity: IParticipationDivisionInfoSnapshotModelData) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.participationDivisionInfoId = entity.participationDivisionInfoId;
    this.participationDivisionId = entity.participationDivisionId;
    this.division = new DivisionModel(entity.division);
  }

  toData(): IParticipationDivisionInfoSnapshotModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      participationDivisionInfoId: this.participationDivisionInfoId,
      participationDivisionId: this.participationDivisionId,
      division: this.division.toData(),
    };
  }
}
