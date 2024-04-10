import { Injectable } from '@nestjs/common';
import { IDivisionPack } from './interface/division-pack.interface';
import { PriceSnapshotEntity } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { IDivision } from './interface/division.interface';
import { ICompetition } from './interface/competition.interface';

// TODO: repository 사용하지 않기
@Injectable()
export class DivisionFactory {
  constructor(
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
    @InjectRepository(PriceSnapshotEntity)
    private readonly priceSnapshotRepository: Repository<PriceSnapshotEntity>,
  ) {}

  createDivision(competitionId: ICompetition['id'], divisionPacks: IDivisionPack[]): IDivision[] {
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
      // TODO: repository 사용하지 않기
      const division = this.divisionRepository.create({
        competitionId,
        category,
        uniform,
        gender,
        belt,
        weight,
        birthYearRangeStart: divisionPack.birthYearRangeStart,
        birthYearRangeEnd: divisionPack.birthYearRangeEnd,
        status: 'ACTIVE',
        priceSnapshots: [this.priceSnapshotRepository.create({ price: divisionPack.price })],
      });
      return division;
    });

    return divisions;
  }

  private cartesian(...arrays: any[][]): any[][] {
    return arrays.reduce((acc, curr) => acc.flatMap((c) => curr.map((n) => [].concat(c, n))), [[]]);
  }
}
