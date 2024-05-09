import { IDivisionPack } from 'src/modules/competitions/domain/interface/division-pack.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

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

  private generateBirthYearRange(category: string): { birthYearRangeStart: string; birthYearRangeEnd: string } {
    const currentYear = new Date().getFullYear();
    let birthYearRangeStart: number, birthYearRangeEnd: number;

    switch (category) {
      case '초등부12':
        birthYearRangeStart = currentYear - 9;
        birthYearRangeEnd = currentYear - 8;
        break;
      case '초등부34':
        birthYearRangeStart = currentYear - 11;
        birthYearRangeEnd = currentYear - 10;
        break;
      case '초등부56':
        birthYearRangeStart = currentYear - 13;
        birthYearRangeEnd = currentYear - 12;
        break;
      case '초등부123':
        birthYearRangeStart = currentYear - 13;
        birthYearRangeEnd = currentYear - 8;
        break;
      case '초등부456':
        birthYearRangeStart = currentYear - 13;
        birthYearRangeEnd = currentYear - 10;
        break;
      case '중등부':
        birthYearRangeStart = currentYear - 16;
        birthYearRangeEnd = currentYear - 14;
        break;
      case '고등부':
        birthYearRangeStart = currentYear - 19;
        birthYearRangeEnd = currentYear - 17;
        break;
      case '어덜트':
        birthYearRangeStart = 1900;
        birthYearRangeEnd = currentYear - 20;
        break;
      case '마스터':
        birthYearRangeStart = 1900;
        birthYearRangeEnd = currentYear - 30;
        break;
      default:
        birthYearRangeStart = 1900;
        birthYearRangeEnd = 9999;
    }
    return { birthYearRangeStart: birthYearRangeStart.toString(), birthYearRangeEnd: birthYearRangeEnd.toString() };
  }

  build(): IDivisionPack {
    return this.divisionPack as IDivisionPack;
  }
}

interface IDivisionPackData {
  category: string[];
  uniforms: IDivision['uniform'][];
  genders: IDivision['gender'][];
  belts: string[];
  weights: string[];
  price: number;
}

const divisionPackData: IDivisionPackData[] = [
  {
    category: ['초등부12'],
    uniforms: ['GI'],
    genders: ['MIXED'],
    belts: ['화이트', '유색'],
    weights: ['-20', '-25', '-30', '-35', '-40', '-45', '-50', '-55', '+55'],
    price: 40000,
  },
  {
    category: ['초등부34'],
    uniforms: ['GI'],
    genders: ['MALE', 'FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-25', '-30', '-35', '-40', '-45', '-50', '-55', '-60', '-65', '+65'],
    price: 40000,
  },
  {
    category: ['초등부56'],
    uniforms: ['GI'],
    genders: ['MALE', 'FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-25', '-30', '-35', '-40', '-45', '-50', '-55', '-60', '-65', '+65'],
    price: 40000,
  },
  {
    category: ['중등부'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '유색'],
    weights: ['-48', '-53', '-58', '-64', '-70', '-76', '-82', '-88', '-94', '+94', 'ABSOLUTE'],
    price: 40000,
  },
  {
    category: ['중등부'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', 'ABSOLUTE'],
    price: 40000,
  },
  {
    category: ['고등부'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '유색'],
    weights: ['-53', '-58', '-64', '-70', '-76', '-82', '-88', '-94', '-100', '+100', 'ABSOLUTE'],
    price: 40000,
  },
  {
    category: ['고등부'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '유색'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', 'ABSOLUTE'],
    price: 40000,
  },
  {
    category: ['어덜트'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-58', '-64', '-70', '-76', '-82', '-88', '-94', '-100', '+100', '-76_ABSOLUTE', '+76_ABSOLUTE'],
    price: 50000,
  },
  {
    category: ['어덜트'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', '-58_ABSOLUTE', '+58_ABSOLUTE'],
    price: 50000,
  },
  {
    category: ['마스터'],
    uniforms: ['GI'],
    genders: ['MALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-58', '-64', '-70', '-76', '-82', '-88', '-94', '-100', '+100', '-76_ABSOLUTE', '+76_ABSOLUTE'],
    price: 50000,
  },
  {
    category: ['마스터'],
    uniforms: ['GI'],
    genders: ['FEMALE'],
    belts: ['화이트', '블루', '퍼플', '브라운', '블랙'],
    weights: ['-43', '-48', '-53', '-58', '-64', '-69', '-74', '-80', '+80', '-58_ABSOLUTE', '+58_ABSOLUTE'],
    price: 50000,
  },
  {
    category: ['노기통합'],
    uniforms: ['NOGI'],
    genders: ['MALE'],
    belts: ['초급', '중급', '고급'],
    weights: ['-40', '-45', '-50', '-55', '-60', '-65', '-70', '-76', '-82', '+82', 'ABSOLUTE'],
    price: 50000,
  },
  {
    category: ['노기통합'],
    uniforms: ['NOGI'],
    genders: ['FEMALE'],
    belts: ['초급', '중급', '고급'],
    weights: ['-35', '-40', '-45', '-50', '-55', '-60', '-65', '-70', '+70', 'ABSOLUTE'],
    price: 50000,
  },
];

export const generateDivisionPacks = (): IDivisionPack[] => {
  return divisionPackData.map((data) =>
    new DivisionPackDummyBuilder()
      .setCategory(data.category)
      .setUniforms(data.uniforms)
      .setGenders(data.genders)
      .setBelts(data.belts)
      .setWeights(data.weights)
      .setPrice(data.price)
      .build(),
  );
};
