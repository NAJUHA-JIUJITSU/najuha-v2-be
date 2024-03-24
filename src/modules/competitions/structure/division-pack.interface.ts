import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { PriceSnapshotEntity } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';

export interface IDivisionPack {
  categorys: DivisionEntity['category'][];
  uniforms: DivisionEntity['uniform'][];
  genders: DivisionEntity['gender'][];
  belts: DivisionEntity['belt'][];
  weights: DivisionEntity['weight'][];
  birthYearRangeStart: DivisionEntity['birthYearRangeStart'];
  birthYearRangeEnd: DivisionEntity['birthYearRangeEnd'];
  price: PriceSnapshotEntity['price'];
}
