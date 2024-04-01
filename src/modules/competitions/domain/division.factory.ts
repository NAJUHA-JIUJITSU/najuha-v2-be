import { Injectable } from '@nestjs/common';
import { IDivisionPack } from './structure/division-pack.interface';
import { PriceSnapshotEntity } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { IDivision } from './structure/division.interface';

@Injectable()
export class DivisionFactory {
  constructor(
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
    @InjectRepository(PriceSnapshotEntity)
    private readonly priceSnapshotRepository: Repository<PriceSnapshotEntity>,
  ) {}

  createDivision(divisionPacks: IDivisionPack[]): IDivision[] {
    const unpackedDivisions = divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...this.unpack(divisionPack)];
    }, []);
    return unpackedDivisions;
  }

  private unpack(divisionPack: IDivisionPack): IDivision[] {
    const combinations = this.cartesian(
      divisionPack.categories,
      divisionPack.uniforms,
      divisionPack.genders,
      divisionPack.belts,
      divisionPack.weights,
    );

    const divisions: IDivision[] = combinations.map(([category, uniform, gender, belt, weight]) => {
      const division = this.divisionRepository.create({
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
