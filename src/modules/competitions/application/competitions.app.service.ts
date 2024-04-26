import { Injectable } from '@nestjs/common';
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
import { InjectRepository } from '@nestjs/typeorm';
import { CompetitionEntity } from 'src/infrastructure/database/entity/competition/competition.entity';
import { DivisionEntity } from 'src/infrastructure/database/entity/competition/division.entity';
import { Repository } from 'typeorm';
import { EarlybirdDiscountSnapshotEntity } from 'src/infrastructure/database/entity/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from 'src/infrastructure/database/entity/competition/combination-discount-snapshot.entity';
import { assert } from 'typia';
import { ICompetition } from '../domain/interface/competition.interface';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { CompetitionPagenationRepository } from '../competition-pagenation.repository';
import { CompetitionFactory } from '../domain/competition.factory';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly divisionFactory: DivisionFactory,
    private readonly competitionFactory: CompetitionFactory,
    private readonly competitionPagenationRepository: CompetitionPagenationRepository,
    @InjectRepository(CompetitionEntity)
    private readonly competitionRepository: Repository<CompetitionEntity>,
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
    @InjectRepository(EarlybirdDiscountSnapshotEntity)
    private readonly earlybirdDiscountSnapshotRepository: Repository<EarlybirdDiscountSnapshotEntity>,
    @InjectRepository(CombinationDiscountSnapshotEntity)
    private readonly combinationDiscountSnapshotRepository: Repository<CombinationDiscountSnapshotEntity>,
  ) {}

  async createCompetition({ competitionCreateDto }: CreateCompetitionParam): Promise<CreateCompetitionRet> {
    const competitionModel = this.competitionFactory.createCompetition(competitionCreateDto);
    const competitionEntity = competitionModel.toEntity();
    await this.competitionRepository.save(competitionEntity);
    return { competition: competitionEntity };
  }

  async updateCompetition({ competitionUpdateDto }: UpdateCompetitionParam): Promise<UpdateCompetitionRet> {
    let competitionEntity = assert<ICompetition>(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionUpdateDto.id },
          relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionEntity = assert<ICompetition>({ ...competitionEntity, ...competitionUpdateDto });
    await this.competitionRepository.save(competitionEntity);
    return { competition: competitionEntity };
  }

  async findCompetitions(query: FindCompetitionsParam): Promise<FindCompetitionsRet> {
    const competitionEntites = assert<Omit<ICompetition, 'divisions' | 'combinationDiscountSnapshots'>[]>(
      await this.competitionPagenationRepository.findMany({
        ...query,
      }),
    );
    const nextPage = competitionEntites.length === query.limit ? query.page + 1 : null;
    return { competitions: competitionEntites, nextPage };
  }

  async getCompetition({ competitionId, status }: GetCompetitionParam): Promise<GetCompetitionRet> {
    const competitionEntity = assert<ICompetition>(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionId, status },
          relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    return { competition: competitionEntity };
  }

  async updateCompetitionStatus({
    competitionId,
    status,
  }: UpdateCompetitionStatusParam): Promise<UpdateCompetitionRet> {
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: competitionId },
            relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    competition.updateStatus(status);
    const updatedCompetitionEntity = competition.toEntity();
    await this.competitionRepository.save(updatedCompetitionEntity);
    return { competition: updatedCompetitionEntity };
  }

  async createDivisions({ competitionId, divisionPacks }: CreateDivisionsParam): Promise<CreateDivisionsRet> {
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: competitionId },
            relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    const divisionModels = this.divisionFactory.createDivisions(competition.getId(), divisionPacks);
    competition.addDivisions(divisionModels);
    const divisionEntites = divisionModels.map((division) => division.toEntity());
    await this.divisionRepository.save(divisionEntites);
    return { divisions: divisionEntites };
  }

  async createEarlybirdDiscountSnapshot({
    earlybirdDiscountSnapshotCreateDto,
  }: CreateEarlybirdDiscountSnapshotParam): Promise<CreateEarlybirdDiscountSnapshotRet> {
    await this.competitionRepository
      .findOneOrFail({
        where: { id: earlybirdDiscountSnapshotCreateDto.competitionId },
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      });
    const earlybirdDiscountSnapshotModel = this.competitionFactory.createEarlybirdDiscountSnapshot(
      earlybirdDiscountSnapshotCreateDto,
    );
    const earlybirdDiscountSnapshotEntity = earlybirdDiscountSnapshotModel.toEntity();
    await this.earlybirdDiscountSnapshotRepository.save(earlybirdDiscountSnapshotEntity);
    return { earlybirdDiscountSnapshot: earlybirdDiscountSnapshotEntity };
  }

  async createCombinationDiscountSnapshot({
    combinationDiscountSnapshotCreateDto,
  }: CreateCombinationDiscountSnapshotParam): Promise<CreateCombinationDiscountSnapshotRet> {
    await this.competitionRepository
      .findOneOrFail({
        where: { id: combinationDiscountSnapshotCreateDto.competitionId },
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      });
    const combinationDiscountSnapshotModel = this.competitionFactory.createCombinationDiscountSnapshot(
      combinationDiscountSnapshotCreateDto,
    );
    const combinationDiscountSnapshotEntity = combinationDiscountSnapshotModel.toEntity();
    await this.combinationDiscountSnapshotRepository.save(combinationDiscountSnapshotEntity);
    return { combinationDiscountSnapshot: combinationDiscountSnapshotEntity };
  }
}
