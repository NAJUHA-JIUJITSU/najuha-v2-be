import { ICompetition } from '../interface/competition.interface';
import { IDivision } from '../interface/division.interface';
import { IPriceSnapshot } from '../interface/price-snapshot.interface';
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
  public readonly competitionId: ICompetition['id'];
  public readonly priceSnapshots: IPriceSnapshot[];

  constructor(division: IDivision) {
    this.id = division.id;
    this.category = division.category;
    this.uniform = division.uniform;
    this.gender = division.gender;
    this.belt = division.belt;
    this.weight = division.weight;
    this.birthYearRangeStart = division.birthYearRangeStart;
    this.birthYearRangeEnd = division.birthYearRangeEnd;
    this.status = division.status;
    this.createdAt = division.createdAt;
    this.updatedAt = division.updatedAt;
    this.competitionId = division.competitionId;
    this.priceSnapshots = division.priceSnapshots.map((priceSnapshot) => new PriceSnapshotModel(priceSnapshot));
  }
}
