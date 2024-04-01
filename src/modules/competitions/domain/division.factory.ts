import { Injectable } from '@nestjs/common';
import { Division } from 'src/infrastructure/database/entities/competition/division.entity';
import { IDivisionPack } from './structure/division-pack.interface';
import { PriceSnapshot } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DivisionFactory {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    @InjectRepository(PriceSnapshot)
    private readonly priceSnapshotRepository: Repository<PriceSnapshot>,
  ) {}

  createDivision(divisionPacks: IDivisionPack[]): Division[] {
    const unpackedDivisions = divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...this.unpack(divisionPack)];
    }, []);
    return unpackedDivisions;
  }

  private unpack(divisionPack: IDivisionPack): Division[] {
    const combinations = this.cartesian(
      divisionPack.categories,
      divisionPack.uniforms,
      divisionPack.genders,
      divisionPack.belts,
      divisionPack.weights,
    );

    const divisions: Division[] = combinations.map(([category, uniform, gender, belt, weight]) => {
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
