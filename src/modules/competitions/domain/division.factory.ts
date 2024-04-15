import { Injectable } from '@nestjs/common';
import { IDivisionPack } from './interface/division-pack.interface';
import { IDivision } from './interface/division.interface';
import { ICompetition } from './interface/competition.interface';
import { ulid } from 'ulid';

@Injectable()
export class DivisionFactory {
  createDivisions(competitionId: ICompetition['id'], divisionPacks: IDivisionPack[]): IDivision[] {
    const unpackedDivisions = divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...this.unpack(competitionId, divisionPack)];
    }, []);
    return unpackedDivisions;
  }

  private unpack(competitionId: ICompetition['id'], divisionPack: IDivisionPack): IDivision[] {
    const combinations = this.cartesian(
      divisionPack.categories,
      divisionPack.uniforms,
      divisionPack.genders,
      divisionPack.belts,
      divisionPack.weights,
    );

    const divisions: IDivision[] = combinations.map(([category, uniform, gender, belt, weight]) => {
      const divisionId = ulid();
      const division: IDivision = {
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
            id: ulid(),
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

  private cartesian(...arrays: any[][]): any[][] {
    return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
  }
}
