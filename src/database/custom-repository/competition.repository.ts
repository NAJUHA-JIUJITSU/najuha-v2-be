import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CompetitionEntity } from '../entity/competition/competition.entity';
import { FindCompetitionsParam, GetCompetitionParam } from 'src/modules/competitions/application/competitions.app.dto';

@Injectable()
export class CompetitionRepository extends Repository<CompetitionEntity> {
  constructor(private dataSource: DataSource) {
    super(CompetitionEntity, dataSource.createEntityManager());
  }

  async findManyWithQueryOptions({
    hostId,
    page,
    limit,
    parsedDateFilter,
    locationFilter,
    selectFilter,
    sortOption,
    status,
  }: FindCompetitionsParam) {
    const now = new Date();

    let qb = this.createQueryBuilder('competition');

    qb = qb.leftJoinAndSelect(
      'competition.earlybirdDiscountSnapshots',
      'earlybirdDiscountSnapshots',
      'earlybirdDiscountSnapshots.createdAt = (SELECT MAX(e."createdAt") FROM earlybird_discount_snapshot e WHERE e."competitionId" = competition.id)',
    );

    qb = qb
      .leftJoinAndSelect('competition.competitionPosterImages', 'competitionPosterImages')
      .leftJoinAndSelect('competitionPosterImages.image', 'image');

    if (hostId) {
      qb = qb.innerJoin(
        'competition.competitionHostMaps',
        'competitionHostMaps',
        'competitionHostMaps.hostId = :hostId',
        { hostId },
      );
    }

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

  async findOneWithQueryOptions({ competitionId, hostId, status }: GetCompetitionParam) {
    let qb = this.createQueryBuilder('competition');

    qb = qb
      .leftJoinAndSelect('competition.divisions', 'divisions')
      .leftJoinAndSelect('divisions.priceSnapshots', 'priceSnapshots')
      .leftJoinAndSelect('competition.earlybirdDiscountSnapshots', 'earlybirdDiscountSnapshots')
      .leftJoinAndSelect('competition.combinationDiscountSnapshots', 'combinationDiscountSnapshots')
      .leftJoinAndSelect('competition.requiredAdditionalInfos', 'requiredAdditionalInfos')
      .leftJoinAndSelect('competition.competitionHostMaps', 'competitionHostMaps')
      .leftJoinAndSelect('competition.competitionPosterImages', 'competitionPosterImages')
      .leftJoinAndSelect('competitionPosterImages.image', 'image');

    if (hostId) {
      qb = qb.innerJoin('competition.competitionHostMaps', 'hostMaps', 'hostMaps.hostId = :hostId', { hostId });
    }

    if (status) {
      qb = qb.andWhere('competition.status = :status', { status });
    }

    const competition = await qb.where('competition.id = :competitionId', { competitionId }).getOne();
    return competition;
  }
}
