import { Competition } from './competition.entity';
import { Division } from './division.entity';
import { PriceSnapshot } from './price-snapshot.entity';

export class DivisionPack {
  categorys: Division['category'][];
  uniforms: Division['uniform'][];
  genders: Division['gender'][];
  belts: Division['belt'][];
  weights: Division['weight'][];
  birthYearRangeStart: Division['birthYearRangeStart'];
  birthYearRangeEnd: Division['birthYearRangeEnd'];
  price: PriceSnapshot['price'];

  constructor(divisionPack: DivisionPack) {
    this.categorys = divisionPack.categorys;
    this.uniforms = divisionPack.uniforms;
    this.genders = divisionPack.genders;
    this.belts = divisionPack.belts;
    this.weights = divisionPack.weights;
    this.birthYearRangeStart = divisionPack.birthYearRangeStart;
    this.birthYearRangeEnd = divisionPack.birthYearRangeEnd;
    this.price = divisionPack.price;
  }

  unpack(id: Competition['id']): Division[] {
    const divisions: Division[] = [];
    this.categorys.map((category) => {
      this.uniforms.map((uniform) => {
        this.genders.map((gender) => {
          this.belts.map((belt) => {
            this.weights.map((weight) => {
              const division = new Division();
              division.competitionId = id;
              division.category = category;
              division.uniform = uniform;
              division.gender = gender;
              division.belt = belt;
              division.weight = weight;
              division.birthYearRangeStart = this.birthYearRangeStart;
              division.birthYearRangeEnd = this.birthYearRangeEnd;
              const priceSnapshot = new PriceSnapshot();
              priceSnapshot.price = this.price;
              division.priceSnapshots = [priceSnapshot];
              divisions.push(division);
            });
          });
        });
      });
    });
    return divisions;
  }
}
