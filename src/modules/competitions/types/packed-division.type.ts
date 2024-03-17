import { Division } from '../domain/entities/division.entity';

export interface PackedDivision {
  categorys: Division['category'][];
  uniforms: Division['uniform'][];
  genders: Division['gender'][];
  belts: Division['belt'][];
  weights: Division['weight'][];
  birthYearRangeStarts: Division['birthYearRangeStart'];
  birthYearRangeEnds: Division['birthYearRangeEnd'];
  price: Division['price'];
}
