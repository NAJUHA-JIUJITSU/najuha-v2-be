import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { Competition } from './domain/entities/competition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './domain/entities/division.entity';
import { EarlybirdDiscountSnapshot } from './domain/entities/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from './domain/entities/combination-discount-snapshot.entity';

@Injectable()
export class CompetitionRepository {
  constructor(
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    @InjectRepository(EarlybirdDiscountSnapshot)
    private readonly earlybirdDiscountSnapshotRepository: Repository<EarlybirdDiscountSnapshot>,
    @InjectRepository(CombinationDiscountSnapshot)
    private readonly combinationDiscountSnapshotRepository: Repository<CombinationDiscountSnapshot>,
  ) {}

  // ----------------- Competition -----------------

  async createCompetition(dto: Partial<Competition>): Promise<Competition> {
    const competition = this.competitionRepository.create(dto);
    return await this.competitionRepository.save(competition);
  }

  async findCompetitons(options?: {
    where?: Partial<Pick<Competition, 'status'>>;
    relations?: string[];
  }): Promise<Competition[]> {
    return await this.competitionRepository.find(options);
  }

  async getCompetition(options?: {
    where?: Partial<Pick<Competition, 'id' | 'status'>>;
    relations?: string[];
  }): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({
      where: options?.where,
      relations: options?.relations,
    });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  async saveCompetition(competition: Pick<Competition, 'id'> & Partial<Competition>): Promise<Competition> {
    return await this.competitionRepository.save(competition);
  }

  async updateCompetition(dto: Pick<Competition, 'id'> & Partial<Competition>): Promise<void> {
    const result = await this.competitionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
  }

  // ----------------- EarlybirdDiscountSnapshot -----------------
  async createEarlybirdDiscount(
    id: Competition['id'],
    dto: Pick<EarlybirdDiscountSnapshot, 'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount'>,
  ): Promise<EarlybirdDiscountSnapshot> {
    const earlybirdDiscountSnapshot = this.earlybirdDiscountSnapshotRepository.create(dto);
    earlybirdDiscountSnapshot.competitionId = id;
    return await this.earlybirdDiscountSnapshotRepository.save(earlybirdDiscountSnapshot);
  }

  // ----------------- CombinationDiscountSnapshot -----------------
  async createCombinationDiscount(
    id: Competition['id'],
    dto: Pick<CombinationDiscountSnapshot, 'combinationDiscountRules'>,
  ): Promise<CombinationDiscountSnapshot> {
    const combinationDiscountSnapshot = this.combinationDiscountSnapshotRepository.create(dto);
    combinationDiscountSnapshot.competitionId = id;
    return await this.combinationDiscountSnapshotRepository.save(combinationDiscountSnapshot);
  }
}
