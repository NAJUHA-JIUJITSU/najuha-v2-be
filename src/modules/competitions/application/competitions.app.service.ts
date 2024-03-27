import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../structure/dto/request/create-competition.req.dto';
import { UpdateCompetitionReqDto } from '../structure/dto/request/update-compoetition.req.dto';
import { CreateDivisitonsReqDto } from '../structure/dto/request/create-divisions.req.dto';
import { CompetitionRepository } from 'src/modules/competitions/competition.repository';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from '../domain/entities/combination-discount-snapshot.entity';
import { CreateEarlybirdDiscountSnapshotReqDto } from '../structure/dto/request/create-earlybird-discount-snapshot.req.dto';
import { createCombinationDiscountSnapshotReqDto } from '../structure/dto/request/create-combination-discount-snapshot.req.dto';
import { DivisionFactory } from '../domain/division-factory.service';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionFactory: DivisionFactory,
  ) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<Competition> {
    return await this.competitionRepository.createCompetition(dto);
  }

  async updateCompetition(combinationId: Competition['id'], dto: UpdateCompetitionReqDto): Promise<Competition> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: combinationId } });
    return await this.competitionRepository.saveCompetition({ ...competition, ...dto });
  }

  async findCompetitions(options?: { where?: Partial<Pick<Competition, 'status'>> }): Promise<Competition[]> {
    return await this.competitionRepository.findCompetitons({
      where: options?.where,
      relations: ['earlybirdDiscountSnapshots'],
    });
  }

  async getCompetition(options?: { where?: Partial<Pick<Competition, 'id' | 'status'>> }): Promise<Competition> {
    return await this.competitionRepository.getCompetition({
      where: options?.where,
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
  }

  async updateCompetitionStatus(combinationId: Competition['id'], status: Competition['status']): Promise<Competition> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: combinationId } });
    competition.updateStatus(status);
    return await this.competitionRepository.saveCompetition(competition);
  }

  async createDivisions(competitionId: Competition['id'], dto: CreateDivisitonsReqDto): Promise<Division[]> {
    const competition = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions'],
    });
    const divisions = this.divisionFactory.createDivision(dto.divisionPacks);
    competition.addDivisions(divisions);
    return (await this.competitionRepository.saveCompetition(competition)).divisions || [];
  }

  async createEarlybirdDiscountSnapshot(
    competitionId: Competition['id'],
    dto: CreateEarlybirdDiscountSnapshotReqDto,
  ): Promise<EarlybirdDiscountSnapshot> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: competitionId } });
    return await this.competitionRepository.createEarlybirdDiscount(competition.id, dto);
  }

  async createCombinationDiscountSnapshot(
    competitionId: Competition['id'],
    dto: createCombinationDiscountSnapshotReqDto,
  ): Promise<CombinationDiscountSnapshot> {
    const competition = await this.competitionRepository.getCompetition({ where: { id: competitionId } });
    return await this.competitionRepository.createCombinationDiscount(competition.id, dto);
  }
}
