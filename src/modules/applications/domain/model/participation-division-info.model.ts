import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from 'src/common/response/errorResponse';

export class ParticipationDivisionInfoModel {
  public readonly id: IParticipationDivisionInfo['id'];
  public readonly createdAt: IParticipationDivisionInfo['createdAt'];
  public readonly applicationId: IApplication['id'];
  public readonly participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[];

  constructor(entity: IParticipationDivisionInfo) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.applicationId = entity.applicationId;
    this.participationDivisionInfoSnapshots = entity.participationDivisionInfoSnapshots.map(
      (snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot),
    );
  }

  toEntity(): IParticipationDivisionInfo {
    return {
      id: this.id,
      createdAt: this.createdAt,
      applicationId: this.applicationId,
      participationDivisionInfoSnapshots: this.participationDivisionInfoSnapshots.map((snapshot) =>
        snapshot.toEntity(),
      ),
    };
  }

  getId() {
    return this.id;
  }

  getLatestParticipationDivisionInfoSnapshot() {
    return this.participationDivisionInfoSnapshots[this.participationDivisionInfoSnapshots.length - 1];
  }

  validateDivisionSuitability(playerBirth: IPlayerSnapshot['birth'], playerGender: IPlayerSnapshot['gender']) {
    const division = this.getLatestParticipationDivisionInfoSnapshot().division;
    this.validateDivisionAgeRange(division, playerBirth);
    this.validateDivisionGender(division, playerGender);
  }

  private validateDivisionAgeRange(division: IDivision, playerBirth: IPlayerSnapshot['birth']) {
    const parsedBirthYear = +playerBirth.slice(0, 4);
    if (parsedBirthYear < +division.birthYearRangeStart || parsedBirthYear > +division.birthYearRangeEnd) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.id}, division: ${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight} ${division.birthYearRangeStart}~${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
      );
    }
  }

  private validateDivisionGender(division: IDivision, playerGender: IPlayerSnapshot['gender']) {
    if (division.gender !== 'MIXED' && playerGender !== division.gender) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.id}, division: ${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight} ${division.birthYearRangeStart}~${division.birthYearRangeEnd}, playerGender: ${playerGender}`,
      );
    }
  }

  addParticipationDivisionInfoSnapshot(snapshot: ParticipationDivisionInfoSnapshotModel) {
    this.participationDivisionInfoSnapshots.push(snapshot);
  }
}
