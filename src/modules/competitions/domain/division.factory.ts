// import { Injectable } from '@nestjs/common';
// import { IDivisionPack } from './interface/division-pack.interface';
// import { ICompetition } from './interface/competition.interface';
// import { DivisionModel } from './model/division.model';
// import { PriceSnapshotModel } from './model/price-snapshot.model';

// @Injectable()
// export class DivisionFactory {
//   /**
//    * Create all possible combinations of the given arrays.
//    * ex input: cartesian([1, 2], ['a', 'b'], ['x', 'y'])
//    * ex output: [[1, 'a', 'x'], [1, 'a', 'y'], [1, 'b', 'x'], [1, 'b', 'y'], [2, 'a', 'x'], [2, 'a', 'y'], [2, 'b', 'x'], [2, 'b', 'y']]
//    */
//   private cartesian(...arrays: any[][]): any[][] {
//     return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
//   }

//   createDivisions(competitionId: ICompetition['id'], divisionPacks: IDivisionPack[]): DivisionModel[] {
//     return divisionPacks.reduce<DivisionModel[]>((acc, divisionPack) => {
//       return [...acc, ...this.unpack(competitionId, divisionPack)];
//     }, []);
//   }

//   private unpack(competitionId: ICompetition['id'], divisionPack: IDivisionPack): DivisionModel[] {
//     const combinations = this.cartesian(
//       divisionPack.categories,
//       divisionPack.uniforms,
//       divisionPack.genders,
//       divisionPack.belts,
//       divisionPack.weights,
//     );
//     const divisions: DivisionModel[] = combinations.map(([category, uniform, gender, belt, weight]) => {
//       const newDivision = DivisionModel.create({
//         competitionId,
//         category,
//         uniform,
//         gender,
//         belt,
//         weight,
//         birthYearRangeStart: divisionPack.birthYearRangeStart,
//         birthYearRangeEnd: divisionPack.birthYearRangeEnd,
//       });
//       const newPriceSnapshot = PriceSnapshotModel.create({
//         divisionId: newDivision.getId(),
//         price: divisionPack.price,
//       });
//       newDivision.setPriceSnapshots(newPriceSnapshot);
//       return newDivision;
//     });
//     return divisions;
//   }
// }

import { Injectable } from '@nestjs/common';
import { IDivisionPack } from './interface/division-pack.interface';
import { IDivisionModelData } from './interface/division.interface';
import { ICompetition } from './interface/competition.interface';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class DivisionFactory {
  /**
   * Create all possible combinations of the given arrays.
   * ex input: cartesian([1, 2], ['a', 'b'], ['x', 'y'])
   * ex output: [[1, 'a', 'x'], [1, 'a', 'y'], [1, 'b', 'x'], [1, 'b', 'y'], [2, 'a', 'x'], [2, 'a', 'y'], [2, 'b', 'x'], [2, 'b', 'y']]
   */
  private cartesian(...arrays: any[][]): any[][] {
    return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
  }

  createDivisions(competitionId: ICompetition['id'], divisionPacks: IDivisionPack[]): IDivisionModelData[] {
    return divisionPacks.reduce<IDivisionModelData[]>((acc, divisionPack) => {
      return [...acc, ...this.unpack(competitionId, divisionPack)];
    }, []);
  }

  private unpack(competitionId: ICompetition['id'], divisionPack: IDivisionPack): IDivisionModelData[] {
    const combinations = this.cartesian(
      divisionPack.categories,
      divisionPack.uniforms,
      divisionPack.genders,
      divisionPack.belts,
      divisionPack.weights,
    );

    const divisions: IDivisionModelData[] = combinations.map(([category, uniform, gender, belt, weight]) => {
      const divisionId = uuidv7();
      const division: IDivisionModelData = {
        id: divisionId,
        competitionId,
        category,
        uniform,
        gender,
        belt,
        weight,
        birthYearRangeStart: divisionPack.birthYearRangeStart,
        birthYearRangeEnd: divisionPack.birthYearRangeEnd,
        status: 'ACTIVE',
        priceSnapshots: [
          {
            id: uuidv7(),
            divisionId: divisionId,
            price: divisionPack.price,
            createdAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return division;
    });
    return divisions;
  }
}
