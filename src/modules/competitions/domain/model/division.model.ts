import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { IDivisionModelData } from '../interface/division.interface';
import { PriceSnapshotModel } from './price-snapshot.model';

export class DivisionModel {
  /** properties */
  private readonly _id: IDivisionModelData['id'];
  private readonly _category: IDivisionModelData['category'];
  private readonly _uniform: IDivisionModelData['uniform'];
  private readonly _gender: IDivisionModelData['gender'];
  private readonly _belt: IDivisionModelData['belt'];
  private readonly _weight: IDivisionModelData['weight'];
  private readonly _birthYearRangeStart: IDivisionModelData['birthYearRangeStart'];
  private readonly _birthYearRangeEnd: IDivisionModelData['birthYearRangeEnd'];
  private readonly _status: IDivisionModelData['status'];
  private readonly _createdAt: IDivisionModelData['createdAt'];
  private readonly _updatedAt: IDivisionModelData['updatedAt'];
  private readonly _competitionId: IDivisionModelData['competitionId'];
  /** relations */
  private _priceSnapshots: PriceSnapshotModel[];

  constructor(data: IDivisionModelData) {
    this._id = data.id;
    this._category = data.category;
    this._uniform = data.uniform;
    this._gender = data.gender;
    this._belt = data.belt;
    this._weight = data.weight;
    this._birthYearRangeStart = data.birthYearRangeStart;
    this._birthYearRangeEnd = data.birthYearRangeEnd;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._competitionId = data.competitionId;
    this._priceSnapshots = data.priceSnapshots.map((priceSnapshot) => new PriceSnapshotModel(priceSnapshot));
  }

  toData(): IDivisionModelData {
    return {
      id: this._id,
      category: this._category,
      uniform: this._uniform,
      gender: this._gender,
      belt: this._belt,
      weight: this._weight,
      birthYearRangeStart: this._birthYearRangeStart,
      birthYearRangeEnd: this._birthYearRangeEnd,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      competitionId: this._competitionId,
      priceSnapshots: this._priceSnapshots.map((priceSnapshot) => priceSnapshot.toData()),
    };
  }

  get id() {
    return this._id;
  }

  get category() {
    return this._category;
  }

  get uniform() {
    return this._uniform;
  }

  get gender() {
    return this._gender;
  }

  get belt() {
    return this._belt;
  }

  get weight() {
    return this._weight;
  }

  get birthYearRangeStart() {
    return this._birthYearRangeStart;
  }

  get birthYearRangeEnd() {
    return this._birthYearRangeEnd;
  }

  get status() {
    return this._status;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get competitionId() {
    return this._competitionId;
  }

  get priceSnapshots() {
    return [...this._priceSnapshots];
  }

  get latestPriceSnapshot() {
    if (!this._priceSnapshots || this._priceSnapshots.length === 0)
      throw new Error('PriceSnapshots is not initialized in DivisionModel');
    return this._priceSnapshots[this._priceSnapshots.length - 1];
  }

  validateRegisterabelStatus() {
    if (this._status !== 'ACTIVE') {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_NOT_ACTIVE,
        `divisionId: ${this._id} status: ${this._status} : ${this._category} ${this._uniform} ${this.gender} ${this._belt} ${this._weight}`,
      );
    }
  }
}
