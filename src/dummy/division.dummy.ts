import { IDivisionPack } from '../modules/competitions/domain/interface/division-pack.interface';
import { IDivision } from '../modules/competitions/domain/interface/division.interface';
import { assert } from 'typia';

const CURRENT_YEAR = new Date().getFullYear();

const BIRTH_YEAR_RANGES = {
  초등부12: { start: CURRENT_YEAR - 9, end: CURRENT_YEAR - 8 },
  초등부34: { start: CURRENT_YEAR - 11, end: CURRENT_YEAR - 10 },
  초등부56: { start: CURRENT_YEAR - 13, end: CURRENT_YEAR - 12 },
  초등부123: { start: CURRENT_YEAR - 13, end: CURRENT_YEAR - 8 },
  초등부456: { start: CURRENT_YEAR - 13, end: CURRENT_YEAR - 10 },
  중등부: { start: CURRENT_YEAR - 16, end: CURRENT_YEAR - 14 },
  고등부: { start: CURRENT_YEAR - 19, end: CURRENT_YEAR - 17 },
  어덜트: { start: 1900, end: CURRENT_YEAR - 20 },
  마스터: { start: 1900, end: CURRENT_YEAR - 30 },
  default: { start: 1900, end: 9999 },
};

const DIVISION_PACK_DUMMY_CASES: Omit<IDivisionPack, 'birthYearRangeStart' | 'birthYearRangeEnd'>[] = [
  {
    categories: ['초등부12'],
    uniforms: ['GI'],
    genders: ['MIXED'],
    belts: ['화이트', '유색'],
    weights: ['-20', '-25', '-30', '-35', '-40', '-45', '-50', '-55', '+55'],
    price: 40000,
  },
  {
    categories: ['초등부34'],
    uniforms: ['GI'],
    genders: ['MALE', 'FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-25', '-30', '-35', '-40', '-45', '-50', '-55', '-60', '-65', '+65'],
    price: 40000,
  },
  {
    categories: ['초등부56'],
    uniforms: ['GI'],
    genders: ['MALE', 'FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-25', '-30', '-35', '-40', '-45', '-50', '-55', '-60', '-65', '+65'],
    price: 40000,
  },
  {
    categories: ['중등부'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '유색'],
    weights: ['-48', '-53', '-58', '-64', '-70', '-76', '-82', '-88', '-94', '+94', 'ABSOLUTE'],
    price: 40000,
  },
  {
    categories: ['중등부'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', 'ABSOLUTE'],
    price: 40000,
  },
  {
    categories: ['고등부'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '유색'],
    weights: ['-53', '-58', '-64', '-70', '-76', '-82', '-88', '-94', '-100', '+100', 'ABSOLUTE'],
    price: 40000,
  },
  {
    categories: ['고등부'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', 'ABSOLUTE'],
    price: 40000,
  },
  {
    categories: ['어덜트'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-58', '-64', '-70', '-76', '-82', '-88', '-94', '-100', '+100', '-76_ABSOLUTE', '+76_ABSOLUTE'],
    price: 50000,
  },
  {
    categories: ['어덜트'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', '-58_ABSOLUTE', '+58_ABSOLUTE'],
    price: 50000,
  },
  {
    categories: ['마스터'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-58', '-64', '-70', '-76', '-82', '-88', '-94', '-100', '+100', '-76_ABSOLUTE', '+76_ABSOLUTE'],
    price: 50000,
  },
  {
    categories: ['마스터'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', '-58_ABSOLUTE', '+58_ABSOLUTE'],
    price: 50000,
  },
  {
    categories: ['노기통합'],
    uniforms: ['NOGI'],
    genders: ['MALE'],
    belts: ['초급', '중급', '고급'],
    weights: ['-50', '-55', '-60', '-65', '-70', '-76', '-82', '+82', 'ABSOLUTE'],
    price: 50000,
  },
  {
    categories: ['노기통합'],
    uniforms: ['NOGI'],
    genders: ['FEMALE'],
    belts: ['초급', '중급', '고급'],
    weights: ['-45', '-50', '-55', '-60', '-65', '-70', '+70', 'ABSOLUTE'],
    price: 50000,
  },
];

export class DivisionPackDummyBuilder {
  private divisionPack: Partial<IDivisionPack>;

  constructor() {
    this.divisionPack = {};
  }

  setCategory(categories: string[]): this {
    this.divisionPack.categories = categories;
    const { birthYearRangeStart, birthYearRangeEnd } = this.generateBirthYearRange(categories[0]);
    this.divisionPack.birthYearRangeStart = birthYearRangeStart;
    this.divisionPack.birthYearRangeEnd = birthYearRangeEnd;
    return this;
  }

  setUniforms(uniforms: IDivisionPack['uniforms']): this {
    this.divisionPack.uniforms = uniforms;
    return this;
  }

  setGenders(genders: IDivision['gender'][]): this {
    this.divisionPack.genders = genders;
    return this;
  }

  setBelts(belts: IDivision['belt'][]): this {
    this.divisionPack.belts = belts;
    return this;
  }

  setWeights(weights: IDivision['weight'][]): this {
    this.divisionPack.weights = weights;
    return this;
  }

  setPrice(price: IDivisionPack['price']): this {
    this.divisionPack.price = price;
    return this;
  }

  private generateBirthYearRange(categories: string): { birthYearRangeStart: string; birthYearRangeEnd: string } {
    const range = BIRTH_YEAR_RANGES[categories] || BIRTH_YEAR_RANGES['default'];

    return {
      birthYearRangeStart: range.start.toString(),
      birthYearRangeEnd: range.end.toString(),
    };
  }

  build(): IDivisionPack {
    return assert<IDivisionPack>(this.divisionPack);
  }
}

export const generateDummyDivisionPacks = (): IDivisionPack[] => {
  return DIVISION_PACK_DUMMY_CASES.map((data) =>
    new DivisionPackDummyBuilder()
      .setCategory(data.categories)
      .setUniforms(data.uniforms)
      .setGenders(data.genders)
      .setBelts(data.belts)
      .setWeights(data.weights)
      .setPrice(data.price)
      .build(),
  );
};
