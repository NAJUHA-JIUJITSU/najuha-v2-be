import { Injectable } from '@nestjs/common';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { IDivisionPack } from '../structure/division-pack.interface';
import { PriceSnapshot } from 'src/modules/competitions/domain/entities/price-snapshot.entity';

// @Injectable()
// export class DivisionPackDomainService {
//   constructor() {}

//   private cartesian(...arrays: any[][]): any[][] {
//     return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
//   }

//   unpack(id: Competition['id'], divisionPack: IDivisionPack): Division[] {
//     const combinations = this.cartesian(
//       divisionPack.categories,
//       divisionPack.uniforms,
//       divisionPack.genders,
//       divisionPack.belts,
//       divisionPack.weights,
//     );

//     const divisions: Division[] = combinations.map(([category, uniform, gender, belt, weight]) => {
//       const division: Division = {
//         competitionId: id,
//         id: 0, // You need to determine how to handle IDs
//         category,
//         uniform,
//         gender,
//         belt,
//         weight,
//         birthYearRangeStart: divisionPack.birthYearRangeStart,
//         birthYearRangeEnd: divisionPack.birthYearRangeEnd,
//         status: 'ACTIVE',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         priceSnapshots: [
//           {
//             id: 0, // Determine ID handling
//             price: divisionPack.price,
//             createdAt: new Date(),
//             divisionId: 0, // This needs to be updated once you have the division ID
//           },
//         ],
//       };

//       return division;
//     });
//     return divisions;
//   }
// }

// @Injectable()
// export class DivisionPackDomainService {
//   constructor() {}

//   private cartesian(...arrays: any[][]): any[][] {
//     return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
//   }

//   unpack(id: Competition['id'], divisionPack: IDivisionPack): Division[] {
//     const combinations = this.cartesian(
//       divisionPack.categories,
//       divisionPack.uniforms,
//       divisionPack.genders,
//       divisionPack.belts,
//       divisionPack.weights,
//     );

//     const divisions: Division[] = combinations.map(([category, uniform, gender, belt, weight]) => {
//       const priceSnapshot = new PriceSnapshot();
//       priceSnapshot.price = divisionPack.price;
//       priceSnapshot.createdAt = new Date();
//       const division = new Division();
//       division.competitionId = id;
//       division.category = category;
//       division.uniform = uniform;
//       division.gender = gender;
//       division.belt = belt;
//       division.weight = weight;
//       division.birthYearRangeStart = divisionPack.birthYearRangeStart;
//       division.birthYearRangeEnd = divisionPack.birthYearRangeEnd;
//       division.status = 'ACTIVE';
//       division.createdAt = new Date();
//       division.updatedAt = new Date();
//       division.priceSnapshots = [priceSnapshot];

//       return division;
//     });
//     return divisions;
//   }
// }

@Injectable()
export class DivisionPackDomainService {
  constructor() {}

  private cartesian(...arrays: any[][]): any[][] {
    return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
  }

  unpack(divisionPack: IDivisionPack): Division[] {
    const combinations = this.cartesian(
      divisionPack.categories,
      divisionPack.uniforms,
      divisionPack.genders,
      divisionPack.belts,
      divisionPack.weights,
    );

    const divisions: Division[] = combinations.map(([category, uniform, gender, belt, weight]) => {
      const division = new Division({
        category,
        uniform,
        gender,
        belt,
        weight,
        birthYearRangeStart: divisionPack.birthYearRangeStart,
        birthYearRangeEnd: divisionPack.birthYearRangeEnd,
        status: 'ACTIVE',
        priceSnapshots: [new PriceSnapshot({ price: divisionPack.price })],
      });

      return division;
    });
    return divisions;
  }
}
