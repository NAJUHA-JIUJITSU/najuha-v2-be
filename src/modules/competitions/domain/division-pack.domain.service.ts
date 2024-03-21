import { Injectable } from '@nestjs/common';
import { ICompetition } from '../structure/competition.interface';
import { IDivision } from '../structure/division.interface';
import { IDivisionPack } from '../structure/division-pack.interface';

@Injectable()
export class DivisionPackDomainService {
  constructor() {}

  unpack(id: ICompetition['id'], divisionPack: IDivisionPack): IDivision[] {
    const divisions: IDivision[] = [];
    divisionPack.categorys.map((category) => {
      divisionPack.uniforms.map((uniform) => {
        divisionPack.genders.map((gender) => {
          divisionPack.belts.map((belt) => {
            divisionPack.weights.map((weight) => {
              const division: IDivision = {
                competitionId: id,
                id: 0, // TODO: id를 어떻게 처리할지 고민해보기
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
              };
              divisions.push(division);
            });
          });
        });
      });
    });
    return divisions;
  }
}
