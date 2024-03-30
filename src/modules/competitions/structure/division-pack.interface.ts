import { Division } from 'src/infrastructure/database/entities/competition/division.entity';
import { PriceSnapshot } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';

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
