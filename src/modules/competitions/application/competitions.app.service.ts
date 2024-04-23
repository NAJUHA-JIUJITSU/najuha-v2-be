import { Injectable } from '@nestjs/common';
import { CompetitionRepository } from 'src/modules/competitions/competition.repository';
import { DivisionFactory } from '../domain/division.factory';
import {
  CreateCombinationDiscountSnapshotParam,
  CreateCombinationDiscountSnapshotRet,
  CreateCompetitionParam,
  CreateCompetitionRet,
  CreateDivisionsParam,
  CreateDivisionsRet,
  CreateEarlybirdDiscountSnapshotParam,
  CreateEarlybirdDiscountSnapshotRet,
  FindCompetitionsParam,
  FindCompetitionsRet,
  GetCompetitionParam,
  GetCompetitionRet,
  UpdateCompetitionParam,
  UpdateCompetitionRet,
  UpdateCompetitionStatusParam,
} from './dtos';
import { CompetitionModel } from '../domain/model/competition.model';
import { ulid } from 'ulid';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionFactory: DivisionFactory,
  ) {}

  async createCompetition({ creatCompetitionDto }: CreateCompetitionParam): Promise<CreateCompetitionRet> {
    const competition = await this.competitionRepository.createCompetition({ ...creatCompetitionDto, id: ulid() });
    return { competition };
  }

  async updateCompetition({ updateCompetitionDto }: UpdateCompetitionParam): Promise<UpdateCompetitionRet> {
    let competition = await this.competitionRepository.getCompetition({
      where: { id: updateCompetitionDto.id },
    });

    competition = await this.competitionRepository.saveCompetition({
      ...competition,
      ...updateCompetitionDto,
    });

    return { competition };
  }

  async findCompetitions(query: FindCompetitionsParam): Promise<FindCompetitionsRet> {
    const { page, limit = 10, dateFilter, locationFilter, selectFilter, sortOption = '일자순', status } = query;
    const parsedDateFilter = dateFilter ? new Date(dateFilter) : new Date();
    const competitions = await this.competitionRepository.findCompetitionsWithQuery({
      page,
      limit,
      parsedDateFilter,
      locationFilter,
      selectFilter,
      sortOption,
      status,
    });
    const nextPage = competitions.length === limit ? page + 1 : null;
    console.log('competition.length', competitions.length);
    return { competitions, nextPage };
  }

  async getCompetition({ competitionId, status }: GetCompetitionParam): Promise<GetCompetitionRet> {
    const competition = await this.competitionRepository.getCompetition({
      where: { id: competitionId, status: status },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    return { competition };
  }

  async updateCompetitionStatus({
    competitionId,
    status,
  }: UpdateCompetitionStatusParam): Promise<UpdateCompetitionRet> {
    const competitionEntity = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionModel(competitionEntity);
    competition.updateStatus(status);
    await this.competitionRepository.saveCompetition(competition);
    return { competition };
  }

  async createDivisions({ competitionId, divisionPacks }: CreateDivisionsParam): Promise<CreateDivisionsRet> {
    const competitionEntity = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionModel(competitionEntity);
    const divisions = this.divisionFactory.createDivisions(competition.id, divisionPacks);
    competition.addDivisions(divisions);
    await this.competitionRepository.saveDivisions(divisions);
    return { divisions };
  }

  async createEarlybirdDiscountSnapshot({
    competitionId,
    earlybirdDiscount,
  }: CreateEarlybirdDiscountSnapshotParam): Promise<CreateEarlybirdDiscountSnapshotRet> {
    const competition = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
    });
    const earlybirdDiscountSnapshot = await this.competitionRepository.createEarlybirdDiscount({
      id: ulid(),
      competitionId: competition.id,
      ...earlybirdDiscount,
      createdAt: new Date(),
    });
    return { earlybirdDiscountSnapshot };
  }

  async createCombinationDiscountSnapshot({
    competitionId,
    combinationDiscount,
  }: CreateCombinationDiscountSnapshotParam): Promise<CreateCombinationDiscountSnapshotRet> {
    const competition = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
    });
    const combinationDiscountSnapshot = await this.competitionRepository.createCombinationDiscount({
      id: ulid(),
      competitionId: competition.id,
      ...combinationDiscount,
      createdAt: new Date(),
    });
    return { combinationDiscountSnapshot };
  }
}
