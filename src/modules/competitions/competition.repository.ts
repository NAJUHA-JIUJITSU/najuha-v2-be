import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { In, Repository } from 'typeorm';
import { CompetitionEntity } from '../../infrastructure/database/entities/competition/competition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EarlybirdDiscountSnapshotEntity } from '../../infrastructure/database/entities/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../../infrastructure/database/entities/competition/combination-discount-snapshot.entity';
import { ICompetition } from './domain/interface/competition.interface';
import { IEarlybirdDiscountSnapshot } from './domain/interface/earlybird-discount-snapshot.interface';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { IDivision } from './domain/interface/division.interface';
import { ICombinationDiscountSnapshot } from './domain/interface/combination-discount-snapshot.interface';

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
    const competition = this.competitionRepository.create(dto);
    return await this.competitionRepository.save(competition);
  }

  async findCompetitons(options?: {
    where?: Partial<Pick<ICompetition, 'status'>>;
    relations?: string[];
  }): Promise<ICompetition.Find.Competition[]> {
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
  async saveDivisions(dto: Partial<IDivision>[]): Promise<DivisionEntity[]> {
    return await this.divisionRepository.save(dto);
  }

  // ----------------- EarlybirdDiscountSnapshot -----------------
  async createEarlybirdDiscount(
    id: ICompetition['id'],
    dto: Pick<IEarlybirdDiscountSnapshot, 'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount'>,
  ): Promise<IEarlybirdDiscountSnapshot> {
    const earlybirdDiscountSnapshot = this.earlybirdDiscountSnapshotRepository.create(dto);
    earlybirdDiscountSnapshot.competitionId = id;
    return await this.earlybirdDiscountSnapshotRepository.save(earlybirdDiscountSnapshot);
  }

  // ----------------- CombinationDiscountSnapshotEntity -----------------
  async createCombinationDiscount(
    id: ICompetition['id'],
    dto: Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules'>,
  ): Promise<CombinationDiscountSnapshotEntity> {
    const combinationDiscountSnapshot = this.combinationDiscountSnapshotRepository.create(dto);
    combinationDiscountSnapshot.competitionId = id;
    return await this.combinationDiscountSnapshotRepository.save(combinationDiscountSnapshot);
  }
}
