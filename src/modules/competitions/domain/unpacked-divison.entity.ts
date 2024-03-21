import { Competition } from './competition.entity';
import { DivisionPack } from './division-pack.entity';
import { Division } from './division.entity';
import { PriceSnapshot } from './price-snapshot.entity';

export class UnpackedDivision {
  competitionId: Division['competitionId'];
  category: Division['category'];
  uniform: Division['uniform'];
  gender: Division['gender'];
  belt: Division['belt'];
  weight: Division['weight'];
  birthYearRangeStart: Division['birthYearRangeStart'];
  birthYearRangeEnd: Division['birthYearRangeEnd'];
  price: PriceSnapshot['price'];

  constructor(unpackedDivision: UnpackedDivision) {
    this.competitionId = unpackedDivision.competitionId;
    this.category = unpackedDivision.category;
    this.uniform = unpackedDivision.uniform;
    this.gender = unpackedDivision.gender;
    this.belt = unpackedDivision.belt;
    this.weight = unpackedDivision.weight;
    this.birthYearRangeStart = unpackedDivision.birthYearRangeStart;
    this.birthYearRangeEnd = unpackedDivision.birthYearRangeEnd;
    this.price = unpackedDivision.price;
  }
}
