import { IParticipationDivisionInfoSnapshotModelData } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { DivisionModel } from '../../../competitions/domain/model/division.model';

export class ParticipationDivisionInfoSnapshotModel {
  public readonly id: IParticipationDivisionInfoSnapshotModelData['id'];
  public readonly createdAt: IParticipationDivisionInfoSnapshotModelData['createdAt'];
  public readonly participationDivisionInfoId: IParticipationDivisionInfo['id'];
  public readonly divisionId: IDivision['id'];
  public readonly division: DivisionModel;

  constructor(data: IParticipationDivisionInfoSnapshotModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.participationDivisionInfoId = data.participationDivisionInfoId;
    this.divisionId = data.divisionId;
    this.division = new DivisionModel(data.division);
  }

  toData(): IParticipationDivisionInfoSnapshotModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      participationDivisionInfoId: this.participationDivisionInfoId,
      divisionId: this.divisionId,
      division: this.division.toData(),
    };
  }
}
