import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { PriceSnapshot } from 'src/modules/competitions/domain/entities/price-snapshot.entity';

export interface IDivisionPack {
  categories: Division['category'][];
  uniforms: Division['uniform'][];
  genders: Division['gender'][];
  belts: Division['belt'][];
  weights: Division['weight'][];
  birthYearRangeStart: Division['birthYearRangeStart'];
  birthYearRangeEnd: Division['birthYearRangeEnd'];
  price: PriceSnapshot['price'];
}
