import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { UpdateCompetitionReqDto } from '../dto/request/update-compoetition.req.dto';
import { CreateDivisitonsReqDto } from '../dto/request/create-divisions.req.dto';
import { CompetitionRepository } from 'src/modules/competitions/competition.repository';
import { EarlybirdDiscountSnapshot } from 'src/infrastructure/database/entities/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from '../../../infrastructure/database/entities/competition/combination-discount-snapshot.entity';
import { CreateEarlybirdDiscountSnapshotReqDto } from '../dto/request/create-earlybird-discount-snapshot.req.dto';
import { createCombinationDiscountSnapshotReqDto } from '../dto/request/create-combination-discount-snapshot.req.dto';
import { DivisionFactory } from '../domain/division.factory';
import { ICompetition } from '../domain/structure/competition.interface';
import { CompetitionValidator } from '../domain/competition.validator';
import { IDivision } from '../domain/structure/division.interface';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionFactory: DivisionFactory,
    private readonly competitionValidator: CompetitionValidator,
  ) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<ICompetition> {
    return await this.competitionRepository.createCompetition(dto);
  }

  async updateCompetition(combinationId: ICompetition['id'], dto: UpdateCompetitionReqDto): Promise<ICompetition> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: combinationId } });
    return await this.competitionRepository.saveCompetition({ ...competition, ...dto });
  }

  async findCompetitions(options?: { where?: Partial<Pick<ICompetition, 'status'>> }): Promise<ICompetition[]> {
    return await this.competitionRepository.findCompetitons({
      where: options?.where,
      relations: ['earlybirdDiscountSnapshots'],
    });
  }

  async getCompetition(options?: { where?: Partial<Pick<ICompetition, 'id' | 'status'>> }): Promise<ICompetition> {
    return await this.competitionRepository.getCompetition({
      where: options?.where,
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
  }

  async updateCompetitionStatus(
    combinationId: ICompetition['id'],
    status: ICompetition['status'],
  ): Promise<ICompetition> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: combinationId } });
    if (status === 'ACTIVE') this.competitionValidator.validateCanBeActive(competition);
    competition.status = status;
    return await this.competitionRepository.saveCompetition(competition);
  }

  async createDivisions(competitionId: ICompetition['id'], dto: CreateDivisitonsReqDto): Promise<IDivision[]> {
    const competition = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions'],
    });
    const newDivisions = this.divisionFactory.createDivision(dto.divisionPacks);
    this.competitionValidator.validateDuplicateDivisions(competition, newDivisions);
    competition.divisions = [...competition.divisions, ...newDivisions];
    return (await this.competitionRepository.saveCompetition(competition)).divisions;
  }

  async createEarlybirdDiscountSnapshot(
    competitionId: ICompetition['id'],
    dto: CreateEarlybirdDiscountSnapshotReqDto,
  ): Promise<EarlybirdDiscountSnapshot> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: competitionId } });
    return await this.competitionRepository.createEarlybirdDiscount(competition.id, dto);
  }

  async createCombinationDiscountSnapshot(
    competitionId: ICompetition['id'],
    dto: createCombinationDiscountSnapshotReqDto,
  ): Promise<CombinationDiscountSnapshot> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: competitionId } });
    return await this.competitionRepository.createCombinationDiscount(competition.id, dto);
  }
}
