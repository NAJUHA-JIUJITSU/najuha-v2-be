import { Injectable } from '@nestjs/common';
import { Division } from '../entities/division.entity';
import { PackedDivision } from '../../types/packed-division.type';
import { Competition } from '../entities/competition.entity';

@Injectable()
export class DivisonDomainService {
  unpackDivisions(competitionId: Competition['id'], packedDivsions: PackedDivision[]): Division[] {
    const divisions: Division[] = [];
    packedDivsions.map((packedDivision) => {
      packedDivision.categorys.map((category) => {
        packedDivision.uniforms.map((uniform) => {
          packedDivision.genders.map((gender) => {
            packedDivision.belts.map((belt) => {
              packedDivision.weights.map((weight) => {
                const division = new Division();
                division.category = category;
                division.uniform = uniform;
                division.gender = gender;
                division.belt = belt;
                division.weight = weight;
                division.birthYearRangeStart = packedDivision.birthYearRangeStarts;
                division.birthYearRangeEnd = packedDivision.birthYearRangeEnds;
                division.price = packedDivision.price;
                division.competitionId = competitionId;
                divisions.push(division);
              });
            });
          });
        });
      });
    });
    console.log('divisions: ', divisions);
    console.log('length: ', divisions.length);
    return divisions;
  }
}
