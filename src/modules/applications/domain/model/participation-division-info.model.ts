import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfoModelData } from '../interface/participation-division-info.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { DivisionModel } from '../../../competitions/domain/model/division.model';
import { PriceSnapshotModel } from '../../../competitions/domain/model/price-snapshot.model';

export class ParticipationDivisionInfoModel {
  private readonly id: IParticipationDivisionInfoModelData['id'];
  private readonly createdAt: IParticipationDivisionInfoModelData['createdAt'];
  private readonly applicationId: IApplication['id'];
  private readonly participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[];
  private readonly payedDivisionId: IParticipationDivisionInfoModelData['payedDivisionId'];
  private readonly payedPriceSnapshotId: IParticipationDivisionInfoModelData['payedPriceSnapshotId'];
  private readonly payedDivision: DivisionModel | null;
  private readonly payedPriceSnapshot: PriceSnapshotModel | null;

  constructor(data: IParticipationDivisionInfoModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.applicationId = data.applicationId;
    this.participationDivisionInfoSnapshots = data.participationDivisionInfoSnapshots.map(
      (snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot),
    );
    this.payedDivisionId = data.payedDivisionId;
    this.payedPriceSnapshotId = data.payedPriceSnapshotId;
    this.payedDivision = data.payedDivision ? new DivisionModel(data.payedDivision) : null;
    this.payedPriceSnapshot = data.payedPriceSnapshot ? new PriceSnapshotModel(data.payedPriceSnapshot) : null;
  }

  toData(): IParticipationDivisionInfoModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      applicationId: this.applicationId,
      participationDivisionInfoSnapshots: this.participationDivisionInfoSnapshots.map((snapshot) => snapshot.toData()),
      payedDivisionId: this.payedDivisionId,
      payedPriceSnapshotId: this.payedPriceSnapshotId,
      payedDivision: this.payedDivision ? this.payedDivision.toData() : null,
      payedPriceSnapshot: this.payedPriceSnapshot ? this.payedPriceSnapshot.toData() : null,
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
