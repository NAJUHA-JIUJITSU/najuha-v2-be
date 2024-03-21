import { IDivision } from './division.interface';
import { IPriceSnapshot } from './price-snapshot.interface';

export interface IDivisionPack {
  categorys: IDivision['category'][];
  uniforms: IDivision['uniform'][];
  genders: IDivision['gender'][];
  belts: IDivision['belt'][];
  weights: IDivision['weight'][];
  birthYearRangeStart: IDivision['birthYearRangeStart'];
  birthYearRangeEnd: IDivision['birthYearRangeEnd'];
  price: IPriceSnapshot['price'];
}
