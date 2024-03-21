import { Competition } from './competition.entity';
import { Division } from './division.entity';
import { PriceSnapshot } from './price-snapshot.entity';
import { UnpackedDivision } from './unpacked-divison.entity';

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

  unpack(id: Competition['id']): UnpackedDivision[] {
    const divisions: UnpackedDivision[] = [];
    this.categorys.map((category) => {
      this.uniforms.map((uniform) => {
        this.genders.map((gender) => {
          this.belts.map((belt) => {
            this.weights.map((weight) => {
              const division = new UnpackedDivision({
                competitionId: id,
                category,
                uniform,
                gender,
                belt,
                weight,
                birthYearRangeStart: this.birthYearRangeStart,
                birthYearRangeEnd: this.birthYearRangeEnd,
                price: this.price,
              });
              divisions.push(division);
            });
          });
        });
      });
    });
    return divisions;
  }
}
