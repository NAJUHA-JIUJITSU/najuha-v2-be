import { IDivision } from '../interface/division.interface';
import { PriceSnapshotModel } from './price-snapshot.model';

export class DivisionModel {
  public readonly id: IDivision['id'];
  public readonly category: IDivision['category'];
  public readonly uniform: IDivision['uniform'];
  public readonly gender: IDivision['gender'];
  public readonly belt: IDivision['belt'];
  public readonly weight: IDivision['weight'];
  public readonly birthYearRangeStart: IDivision['birthYearRangeStart'];
  public readonly birthYearRangeEnd: IDivision['birthYearRangeEnd'];
  public readonly status: IDivision['status'];
  public readonly createdAt: IDivision['createdAt'];
  public readonly updatedAt: IDivision['updatedAt'];
  public readonly competitionId: IDivision['competitionId'];
  public readonly priceSnapshots: PriceSnapshotModel[];

  constructor(entity: IDivision) {
    this.id = entity.id;
    this.category = entity.category;
    this.uniform = entity.uniform;
    this.gender = entity.gender;
    this.belt = entity.belt;
    this.weight = entity.weight;
    this.birthYearRangeStart = entity.birthYearRangeStart;
    this.birthYearRangeEnd = entity.birthYearRangeEnd;
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.competitionId = entity.competitionId;
    this.priceSnapshots = entity.priceSnapshots.map((priceSnapshot) => new PriceSnapshotModel(priceSnapshot));
  }

  toData(): IDivision {
    return {
      id: this.id,
      category: this.category,
      uniform: this.uniform,
      gender: this.gender,
      belt: this.belt,
      weight: this.weight,
      birthYearRangeStart: this.birthYearRangeStart,
      birthYearRangeEnd: this.birthYearRangeEnd,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      competitionId: this.competitionId,
      priceSnapshots: this.priceSnapshots.map((priceSnapshot) => priceSnapshot.toData()),
    };
  }

  getLatestPriceSnapshot() {
    return this.priceSnapshots[this.priceSnapshots.length - 1];
  }
}
