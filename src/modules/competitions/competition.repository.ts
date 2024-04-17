import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { CompetitionEntity } from '../../infrastructure/database/entity/competition/competition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EarlybirdDiscountSnapshotEntity } from '../../infrastructure/database/entity/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../../infrastructure/database/entity/competition/combination-discount-snapshot.entity';
import { IEarlybirdDiscountSnapshot } from './domain/interface/earlybird-discount-snapshot.interface';
import { DivisionEntity } from 'src/infrastructure/database/entity/competition/division.entity';
import { ICombinationDiscountSnapshot } from './domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from './domain/interface/competition.interface';
import { IDivision } from './domain/interface/division.interface';

@Injectable()
export class CompetitionRepository {
  constructor(
    @InjectRepository(CompetitionEntity)
    private readonly competitionRepository: Repository<CompetitionEntity>,
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
    @InjectRepository(EarlybirdDiscountSnapshotEntity)
    private readonly earlybirdDiscountSnapshotRepository: Repository<EarlybirdDiscountSnapshotEntity>,
    @InjectRepository(CombinationDiscountSnapshotEntity)
    private readonly combinationDiscountSnapshotRepository: Repository<CombinationDiscountSnapshotEntity>,
  ) {}

  // ----------------- Competition -----------------

  async createCompetition(dto: Partial<ICompetition>): Promise<ICompetition> {
    return await this.competitionRepository.save(dto);
  }

  async findCompetitons(options?: {
    where?: Partial<Pick<ICompetition, 'status'>>;
    relations?: string[];
  }): Promise<ICompetition[]> {
    return await this.competitionRepository.find(options);
  }

  async findCompetitionsWithQuery({
    page,
    limit,
    parsedDateFilter,
    locationFilter,
    selectFilter,
    sortOption,
    status,
  }: {
    page: ICompetition.Query.Page;
    limit: ICompetition.Query.Limit;
    parsedDateFilter: ICompetition.Query.parsedDateFilter;
    locationFilter?: ICompetition.Query.LocationFilter;
    selectFilter?: ICompetition.Query.SelectFilter[];
    sortOption: ICompetition.Query.SortOption;
    status?: ICompetition['status'];
  }) {
    const now = new Date();

    let qb = this.competitionRepository.createQueryBuilder('competition');

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

  async getCompetition(options?: {
    where?: Partial<Pick<ICompetition, 'id' | 'status'>>;
    relations?: string[];
  }): Promise<ICompetition> {
    const competition = await this.competitionRepository.findOne({
      where: options?.where,
      relations: options?.relations,
    });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  async saveCompetition(competition: Pick<ICompetition, 'id'> & Partial<ICompetition>): Promise<ICompetition> {
    return await this.competitionRepository.save(competition);
  }

  async updateCompetition(dto: Pick<ICompetition, 'id'> & Partial<ICompetition>): Promise<void> {
    const result = await this.competitionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
  }

  // ----------------- Division -----------------
  async saveDivisions(dto: Partial<IDivision>[]): Promise<IDivision[]> {
    return await this.divisionRepository.save(dto);
  }

  // ----------------- EarlybirdDiscountSnapshot -----------------
  async createEarlybirdDiscount(dto: IEarlybirdDiscountSnapshot): Promise<IEarlybirdDiscountSnapshot> {
    return await this.earlybirdDiscountSnapshotRepository.save(dto);
  }

  // ----------------- CombinationDiscountSnapshotEntity -----------------
  async createCombinationDiscount(dto: ICombinationDiscountSnapshot): Promise<ICombinationDiscountSnapshot> {
    return await this.combinationDiscountSnapshotRepository.save(dto);
  }
}
