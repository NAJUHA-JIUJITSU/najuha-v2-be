import { IParticipationDivisionInfoSnapshotModelData } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { DivisionModel } from '../../../competitions/domain/model/division.model';

export class ParticipationDivisionInfoSnapshotModel {
  /** properties */
  private readonly _id: IParticipationDivisionInfoSnapshotModelData['id'];
  private readonly _createdAt: IParticipationDivisionInfoSnapshotModelData['createdAt'];
  private readonly _participationDivisionInfoId: IParticipationDivisionInfo['id'];
  private readonly _divisionId: IDivision['id'];
  private readonly _division: DivisionModel;

  constructor(data: IParticipationDivisionInfoSnapshotModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._participationDivisionInfoId = data.participationDivisionInfoId;
    this._divisionId = data.divisionId;
    this._division = new DivisionModel(data.division);
  }

  toData(): IParticipationDivisionInfoSnapshotModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      participationDivisionInfoId: this._participationDivisionInfoId,
      divisionId: this._divisionId,
      division: this._division.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get participationDivisionInfoId() {
    return this._participationDivisionInfoId;
  }

  get divisionId() {
    return this._divisionId;
  }

  get division() {
    return this._division;
  }
}
