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
import { CompetitionEntity } from '../domain/entity/competition.entity';
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

  async updateCompetition({ updateCompetition }: UpdateCompetitionParam): Promise<UpdateCompetitionRet> {
    let competition = await this.competitionRepository.getCompetition({
      where: { id: updateCompetition.id },
    });

    competition = await this.competitionRepository.saveCompetition({
      ...competition,
      ...updateCompetition,
    });

    return { competition };
  }

  async findCompetitions(param?: FindCompetitionsParam | null): Promise<FindCompetitionsRet> {
    const competitions = await this.competitionRepository.findCompetitons({
      where: { status: param?.status },
      relations: ['earlybirdDiscountSnapshots'],
    });

    return { competitions };
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
    const competitionEntityData = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionEntity(competitionEntityData);
    competition.updateStatus(status);
    await this.competitionRepository.saveCompetition(competition);
    return { competition };
  }

  async createDivisions({ competitionId, divisionPacks }: CreateDivisionsParam): Promise<CreateDivisionsRet> {
    const competitionEntityData = await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionEntity(competitionEntityData);
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
