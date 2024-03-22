import { Injectable } from '@nestjs/common';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { IDivisionyPack } from '../structure/division-pack.interface';

@Injectable()
export class DivisionPackDomainService {
  constructor() {}

  private cartesian(...arrays: any[][]): any[][] {
    return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
  }

  unpack(id: CompetitionEntity['id'], divisionPack: IDivisionyPack): DivisionEntity[] {
    const combinations = this.cartesian(
      divisionPack.categorys,
      divisionPack.uniforms,
      divisionPack.genders,
      divisionPack.belts,
      divisionPack.weights,
    );

    const divisions: DivisionEntity[] = combinations.map(([category, uniform, gender, belt, weight]) => {
      const division: DivisionEntity = {
        competitionId: id,
        id: 0, // You need to determine how to handle IDs
        category,
        uniform,
        gender,
        belt,
        weight,
        birthYearRangeStart: divisionPack.birthYearRangeStart,
        birthYearRangeEnd: divisionPack.birthYearRangeEnd,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        priceSnapshots: [
          {
            id: 0, // Determine ID handling
            price: divisionPack.price,
            createdAt: new Date(),
            divisionId: 0, // This needs to be updated once you have the division ID
          },
        ],
      };

      return division;
    });
    return divisions;
  }
}
