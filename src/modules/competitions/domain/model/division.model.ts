import { IDivisionModelData } from '../interface/division.interface';
import { PriceSnapshotModel } from './price-snapshot.model';

export class DivisionModel {
  private readonly id: IDivisionModelData['id'];
  private readonly category: IDivisionModelData['category'];
  private readonly uniform: IDivisionModelData['uniform'];
  private readonly gender: IDivisionModelData['gender'];
  private readonly belt: IDivisionModelData['belt'];
  private readonly weight: IDivisionModelData['weight'];
  private readonly birthYearRangeStart: IDivisionModelData['birthYearRangeStart'];
  private readonly birthYearRangeEnd: IDivisionModelData['birthYearRangeEnd'];
  private readonly status: IDivisionModelData['status'];
  private readonly createdAt: IDivisionModelData['createdAt'];
  private readonly updatedAt: IDivisionModelData['updatedAt'];
  private readonly competitionId: IDivisionModelData['competitionId'];
  private priceSnapshots: PriceSnapshotModel[];

  constructor(data: IDivisionModelData) {
    this.id = data.id;
    this.category = data.category;
    this.uniform = data.uniform;
    this.gender = data.gender;
    this.belt = data.belt;
    this.weight = data.weight;
    this.birthYearRangeStart = data.birthYearRangeStart;
    this.birthYearRangeEnd = data.birthYearRangeEnd;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.competitionId = data.competitionId;
    this.priceSnapshots = data.priceSnapshots.map((priceSnapshot) => new PriceSnapshotModel(priceSnapshot));
  }

  toData(): IDivisionModelData {
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

  getId() {
    return this.id;
  }

  getCategory() {
    return this.category;
  }

  getUniform() {
    return this.uniform;
  }

  getGender() {
    return this.gender;
  }

  getBelt() {
    return this.belt;
  }

  getWeight() {
    return this.weight;
  }

  getBirthYearRangeStart() {
    return this.birthYearRangeStart;
  }

  getBirthYearRangeEnd() {
    return this.birthYearRangeEnd;
  }

  getLatestPriceSnapshot() {
    if (!this.priceSnapshots) throw new Error('PriceSnapshots is not initialized in DivisionModel');
    return this.priceSnapshots[this.priceSnapshots.length - 1];
  }
}
