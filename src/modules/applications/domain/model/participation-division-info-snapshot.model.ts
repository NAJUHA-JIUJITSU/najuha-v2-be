import { IParticipationDivisionInfoSnapshot } from '../interface/participation-division-info-snapshot.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { assert } from 'typia';

export class ParticipationDivisionInfoSnapshot {
  public readonly id: IParticipationDivisionInfoSnapshot['id'];
  public readonly createdAt: IParticipationDivisionInfoSnapshot['createdAt'];
  public readonly participationDivisionInfoId: IParticipationDivisionInfo['id'];
  public readonly participationDivisionId: IDivision['id'];
  public readonly division: IDivision;

  constructor(value: IParticipationDivisionInfoSnapshot.ModelValue.Base) {
    assert<IParticipationDivisionInfoSnapshot.ModelValue.Base>(value);
    this.id = value.id;
    this.createdAt = value.createdAt;
    this.participationDivisionInfoId = value.participationDivisionInfoId;
    this.participationDivisionId = value.participationDivisionId;
    this.division = value.division;
  }

  toModelValue(): IParticipationDivisionInfoSnapshot.ModelValue.Base {
    return {
      id: this.id,
      createdAt: this.createdAt,
      participationDivisionInfoId: this.participationDivisionInfoId,
      participationDivisionId: this.participationDivisionId,
      division: this.division,
    };
  }
}
