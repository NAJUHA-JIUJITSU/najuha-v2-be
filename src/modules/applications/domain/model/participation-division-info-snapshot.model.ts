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

  constructor(entity: IParticipationDivisionInfoSnapshot.Entity.Base) {
    assert<IParticipationDivisionInfoSnapshot.Entity.Base>(entity);
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.participationDivisionInfoId = entity.participationDivisionInfoId;
    this.participationDivisionId = entity.participationDivisionId;
    this.division = entity.division;
  }

  toEntity(): IParticipationDivisionInfoSnapshot.Entity.Base {
    return {
      id: this.id,
      createdAt: this.createdAt,
      participationDivisionInfoId: this.participationDivisionInfoId,
      participationDivisionId: this.participationDivisionId,
      division: this.division,
    };
  }
}
