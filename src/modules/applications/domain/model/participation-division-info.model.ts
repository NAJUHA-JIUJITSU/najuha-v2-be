import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfoModelData } from '../interface/participation-division-info.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { DivisionModel } from '../../../competitions/domain/model/division.model';

export class ParticipationDivisionInfoModel {
  public readonly id: IParticipationDivisionInfoModelData['id'];
  public readonly createdAt: IParticipationDivisionInfoModelData['createdAt'];
  public readonly applicationId: IApplication['id'];
  public readonly participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[];

  constructor(entity: IParticipationDivisionInfoModelData) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.applicationId = entity.applicationId;
    this.participationDivisionInfoSnapshots = entity.participationDivisionInfoSnapshots.map(
      (snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot),
    );
  }

  toData(): IParticipationDivisionInfoModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      applicationId: this.applicationId,
      participationDivisionInfoSnapshots: this.participationDivisionInfoSnapshots.map((snapshot) => snapshot.toData()),
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

  private validateDivisionAgeRange(division: DivisionModel, playerBirth: IPlayerSnapshot['birth']) {
    const parsedBirthYear = +playerBirth.slice(0, 4);
    if (parsedBirthYear < +division.getBirthYearRangeStart() || parsedBirthYear > +division.getBirthYearRangeEnd()) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.getId()}, division: ${division.getCategory()} ${division.getUniform()} ${division.getGender()} ${division.getBelt()} ${division.getWeight()} ${division.getBirthYearRangeStart()}~${division.getBirthYearRangeEnd()}, playerBirth: ${playerBirth}`,
      );
    }
  }

  private validateDivisionGender(division: DivisionModel, playerGender: IPlayerSnapshot['gender']) {
    if (division.getGender() !== 'MIXED' && playerGender !== division.getGender()) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.getId()}, division: ${division.getCategory()} ${division.getUniform()} ${division.getGender()} ${division.getBelt()} ${division.getWeight()} ${division.getBirthYearRangeStart()}~${division.getBirthYearRangeEnd()}, playerGender: ${playerGender}`,
      );
    }
  }

  addParticipationDivisionInfoSnapshot(snapshot: ParticipationDivisionInfoSnapshotModel) {
    this.participationDivisionInfoSnapshots.push(snapshot);
  }
}
