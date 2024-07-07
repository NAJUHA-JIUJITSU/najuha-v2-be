import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfoModelData } from '../interface/participation-division-info.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { DivisionModel } from '../../../competitions/domain/model/division.model';

export class ParticipationDivisionInfoModel {
  /** properties */
  private readonly _id: IParticipationDivisionInfoModelData['id'];
  private readonly _createdAt: IParticipationDivisionInfoModelData['createdAt'];
  private readonly _applicationId: IApplication['id'];
  private _status: IParticipationDivisionInfoModelData['status'];
  /** relations */
  private _participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[];

  constructor(data: IParticipationDivisionInfoModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._status = data.status;
    this._applicationId = data.applicationId;
    this._participationDivisionInfoSnapshots = data.participationDivisionInfoSnapshots.map(
      (snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot),
    );
  }

  toData(): IParticipationDivisionInfoModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      status: this._status,
      applicationId: this._applicationId,
      participationDivisionInfoSnapshots: this._participationDivisionInfoSnapshots.map((snapshot) => snapshot.toData()),
    };
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get status() {
    return this._status;
  }

  get applicationId() {
    return this._applicationId;
  }

  get participationDivisionInfoSnapshots() {
    return [...this._participationDivisionInfoSnapshots];
  }

  getOriginParticipationDivisionInfoSnapshot() {
    return this._participationDivisionInfoSnapshots[0];
  }

  getLatestParticipationDivisionInfoSnapshot() {
    return this._participationDivisionInfoSnapshots[this._participationDivisionInfoSnapshots.length - 1];
  }

  validateDivisionSuitability(playerBirth: IPlayerSnapshot['birth'], playerGender: IPlayerSnapshot['gender']) {
    const division = this.getLatestParticipationDivisionInfoSnapshot().division;
    this.validateDivisionAgeRange(division, playerBirth);
    this.validateDivisionGender(division, playerGender);
  }

  private validateDivisionAgeRange(division: DivisionModel, playerBirth: IPlayerSnapshot['birth']) {
    const parsedBirthYear = +playerBirth.slice(0, 4);
    if (parsedBirthYear < +division.birthYearRangeStart || parsedBirthYear > +division.birthYearRangeEnd) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.id}, division: ${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight} ${division.birthYearRangeStart}~${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
      );
    }
  }

  private validateDivisionGender(division: DivisionModel, playerGender: IPlayerSnapshot['gender']) {
    if (division.gender !== 'MIXED' && playerGender !== division.gender) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.id}, division: ${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight} ${division.birthYearRangeStart}~${division.birthYearRangeEnd}, playerGender: ${playerGender}`,
      );
    }
  }

  addParticipationDivisionInfoSnapshot(snapshot: ParticipationDivisionInfoSnapshotModel) {
    this._participationDivisionInfoSnapshots.push(snapshot);
  }

  approve() {
    if (this._status !== 'READY') throw new Error('Only READY status can be approved');
    this._status = 'DONE';
  }

  cancel() {
    if (this._status !== 'DONE') throw new Error('Only DONE status can be canceled');
    this._status = 'CANCELED';
  }
}
