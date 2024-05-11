import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CompetitionEntity } from '../entity/competition/competition.entity';
import { ICompetitionQueryOptions } from 'src/modules/competitions/domain/interface/competition.interface';

@Injectable()
export class CompetitionRepository extends Repository<CompetitionEntity> {
  constructor(private dataSource: DataSource) {
    super(CompetitionEntity, dataSource.createEntityManager());
  }

  async findManyWithQueryOptions({
    page,
    limit,
    parsedDateFilter,
    locationFilter,
    selectFilter,
    sortOption,
    status,
  }: Pick<
    ICompetitionQueryOptions,
    'page' | 'limit' | 'parsedDateFilter' | 'locationFilter' | 'selectFilter' | 'sortOption' | 'status'
  >) {
    const now = new Date();

    let qb = this.createQueryBuilder('competition');

    qb = qb.leftJoinAndSelect(
      'competition.earlybirdDiscountSnapshots',
      'earlybirdDiscountSnapshots',
      'earlybirdDiscountSnapshots.createdAt = (SELECT MAX(e."createdAt") FROM earlybird_discount_snapshot e WHERE e."competitionId" = competition.id)',
    );

    if (status) qb = qb.andWhere('competition.status = :status', { status });

    if (locationFilter) qb = qb.andWhere('competition.address LIKE :location', { location: `%${locationFilter}%` });

    selectFilter?.forEach((filter) => {
      switch (filter) {
        case '간편결제': {
          qb = qb.andWhere('competition.isPartnership = true');
          break;
        }
        case '얼리버드': {
          qb = qb.andWhere('earlybirdDiscountSnapshots.earlybirdStartDate < :now', { now });
          qb = qb.andWhere('earlybirdDiscountSnapshots.earlybirdEndDate > :now', { now });
          break;
        }
        case '신청가능': {
          qb = qb.andWhere('competition.registrationEndDate >= :now', { now });
          break;
        }
        case '단독출전조정': {
          qb = qb.andWhere('competition.soloRegistrationAdjustmentStartDate <= :now', { now });
          qb = qb.andWhere('competition.soloRegistrationAdjustmentEndDate >= :now', { now });
          break;
        }
      }
    });

    switch (sortOption) {
      case '일자순': {
        qb = qb.andWhere('competition.competitionDate >= :parsedDateFilter', { parsedDateFilter });
        qb = qb.orderBy('competition.competitionDate', 'ASC');
        break;
      }
      case '조회순': {
        qb = qb.andWhere('competition.competitionDate >= :parsedDateFilter', { parsedDateFilter });
        qb = qb.orderBy('competition.viewCount', 'DESC');
        break;
      }
      case '마감임박순': {
        qb = qb.andWhere('competition.registrationEndDate >= :parsedDateFilter', { parsedDateFilter });
        qb = qb.orderBy('competition.registrationEndDate', 'ASC');
        break;
      }
    }

    const competitions = await qb
      .skip(page * limit)
      .take(limit)
      .getMany();
    return competitions;
  }
}
