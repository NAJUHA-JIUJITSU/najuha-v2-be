import { Injectable } from '@nestjs/common';
import { CompetitionRepository } from 'src/modules/competitions/competition.repository';
import { DivisionFactory } from '../domain/division.factory';
import { ICompetition } from '../domain/interface/competition.interface';
import { CompetitionValidator } from '../domain/competition.validator';
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

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionFactory: DivisionFactory,
    private readonly competitionValidator: CompetitionValidator,
  ) {}

  async createCompetition({ creatCompetition }: CreateCompetitionParam): Promise<CreateCompetitionRet> {
    const newCompetition = (await this.competitionRepository.createCompetition(
      creatCompetition,
    )) as ICompetition.Create.Competition;

    return { competition: newCompetition };
  }

  async updateCompetition({ updateCompetition }: UpdateCompetitionParam): Promise<UpdateCompetitionRet> {
    let competition = (await this.competitionRepository.getCompetition({
      where: { id: updateCompetition.id },
    })) as ICompetition.Update.Competition;

    competition = (await this.competitionRepository.saveCompetition({
      ...competition,
      ...updateCompetition,
    })) as ICompetition.Update.Competition;

    return { competition };
  }

  async findCompetitions(param?: FindCompetitionsParam | null): Promise<FindCompetitionsRet> {
    const competitions = (await this.competitionRepository.findCompetitons({
      where: { status: param?.status },
      relations: ['earlybirdDiscountSnapshots'],
    })) as ICompetition.Find.Competition[];

    return { competitions };
  }

  async getCompetition({ competitionId, status }: GetCompetitionParam): Promise<GetCompetitionRet> {
    const competition = (await this.competitionRepository.getCompetition({
      where: { id: competitionId, status: status },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    })) as ICompetition.Get.Competition;
    return { competition };
  }

  async updateCompetitionStatus({
    competitionId,
    status,
  }: UpdateCompetitionStatusParam): Promise<UpdateCompetitionRet> {
    let competition = (await this.competitionRepository.getCompetition({
      where: { id: competitionId },
    })) as ICompetition.Update.Competition;
    if (status === 'ACTIVE') this.competitionValidator.validateCanBeActive(competition);
    competition.status = status;
    competition = await this.competitionRepository.saveCompetition(competition);
    return { competition };
  }

  async createDivisions({ competitionId, divisionPacks }: CreateDivisionsParam): Promise<CreateDivisionsRet> {
    const competition = (await this.competitionRepository.getCompetition({
      where: { id: competitionId },
      relations: ['divisions'],
    })) as ICompetition.CreateDivisions.Competition;
    const divisions = this.divisionFactory.createDivision(competition.id, divisionPacks);
    this.competitionValidator.validateDuplicateDivisions(competition, divisions);
    const newDivisions = await this.competitionRepository.saveDivisions(divisions);
    return { divisions: newDivisions };
  }

  async createEarlybirdDiscountSnapshot({
    competitionId,
    earlybirdDiscount,
  }: CreateEarlybirdDiscountSnapshotParam): Promise<CreateEarlybirdDiscountSnapshotRet> {
    const competition = (await this.competitionRepository.getCompetition({
      where: { id: competitionId },
    })) as ICompetition;
    const earlybirdDiscountSnapshot = await this.competitionRepository.createEarlybirdDiscount(
      competition.id,
      earlybirdDiscount,
    );
    return { earlybirdDiscountSnapshot };
  }

  async createCombinationDiscountSnapshot({
    competitionId,
    combinationDiscount,
  }: CreateCombinationDiscountSnapshotParam): Promise<CreateCombinationDiscountSnapshotRet> {
    const competition = (await this.competitionRepository.getCompetition({
      where: { id: competitionId },
    })) as ICompetition;
    const combinationDiscountSnapshot = await this.competitionRepository.createCombinationDiscount(
      competition.id,
      combinationDiscount,
    );
    return { combinationDiscountSnapshot };
  }
}
