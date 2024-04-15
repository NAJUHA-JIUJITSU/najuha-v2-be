import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { CompetitionTable } from '../../infrastructure/database/tables/competition/competition.table';
import { InjectRepository } from '@nestjs/typeorm';
import { EarlybirdDiscountSnapshotTable } from '../../infrastructure/database/tables/competition/earlybird-discount-snapshot.table';
import { CombinationDiscountSnapshotTable } from '../../infrastructure/database/tables/competition/combination-discount-snapshot.table';
import { IEarlybirdDiscountSnapshot } from './domain/interface/earlybird-discount-snapshot.interface';
import { DivisionTable } from 'src/infrastructure/database/tables/competition/division.table';
import { ICombinationDiscountSnapshot } from './domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from './domain/interface/competition.interface';
import { IDivision } from './domain/interface/division.interface';

@Injectable()
export class CompetitionRepository {
  constructor(
    @InjectRepository(CompetitionTable)
    private readonly competitionRepository: Repository<CompetitionTable>,
    @InjectRepository(DivisionTable)
    private readonly divisionRepository: Repository<DivisionTable>,
    @InjectRepository(EarlybirdDiscountSnapshotTable)
    private readonly earlybirdDiscountSnapshotRepository: Repository<EarlybirdDiscountSnapshotTable>,
    @InjectRepository(CombinationDiscountSnapshotTable)
    private readonly combinationDiscountSnapshotRepository: Repository<CombinationDiscountSnapshotTable>,
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

  // ----------------- CombinationDiscountSnapshotTable -----------------
  async createCombinationDiscount(dto: ICombinationDiscountSnapshot): Promise<ICombinationDiscountSnapshot> {
    return await this.combinationDiscountSnapshotRepository.save(dto);
  }
}
