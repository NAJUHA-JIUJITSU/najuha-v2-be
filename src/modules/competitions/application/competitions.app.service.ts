import { Injectable } from '@nestjs/common';
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
  CreateRequiredAdditionalInfoParam,
  createRequiredAdditionalInfoRet,
  DeleteRequiredAdditionalInfoParam,
  UpdateRequiredAdditionalInfoParam,
} from './dtos';
import { CompetitionModel } from '../domain/model/competition.model';
import { assert } from 'typia';
import {
  ICompetitioinWithoutRelations,
  ICompetitionWithDivisions,
  ICompetitionWithEarlybirdDiscountSnapshots,
  ICompetitionWithRelations,
  ICompetitionWithRequiredAdditionalInfo,
} from '../domain/interface/competition.interface';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { CompetitionFactory } from '../domain/competition.factory';
import { CompetitionRepository } from 'src/infrastructure/database/custom-repository/competition.repository';
import { DivisionRepository } from 'src/infrastructure/database/custom-repository/division.repository';
import { EarlybirdDiscountSnapshotRepository } from 'src/infrastructure/database/custom-repository/earlybird-discount-snapshot.repository';
import { CombinationDiscountSnapshotRepository } from 'src/infrastructure/database/custom-repository/combination-discount-snapshot.repository';
import { RequiredAdditionalInfoRepository } from 'src/infrastructure/database/custom-repository/required-addtional-info.repository';
import { IRequiredAdditionalInfo } from '../domain/interface/required-addtional-info.interface';
import { DivisionModel } from '../domain/model/division.model';
import { DivisionFactory } from '../domain/division.factory';
import { RequiredAdditionalInfoModel } from '../domain/model/required-addtional-info.model';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly divisionFactory: DivisionFactory,
    private readonly competitionFactory: CompetitionFactory,
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionRepository: DivisionRepository,
    private readonly earlybirdDiscountSnapshotRepository: EarlybirdDiscountSnapshotRepository,
    private readonly combinationDiscountSnapshotRepository: CombinationDiscountSnapshotRepository,
    private readonly requiredAdditionalInfoRepository: RequiredAdditionalInfoRepository,
  ) {}

  async createCompetition({ competitionCreateDto }: CreateCompetitionParam): Promise<CreateCompetitionRet> {
    const competitionEntity = this.competitionFactory.createCompetition(competitionCreateDto);
    await this.competitionRepository.save(competitionEntity);
    return { competition: competitionEntity };
  }

  async updateCompetition({ competitionUpdateDto }: UpdateCompetitionParam): Promise<UpdateCompetitionRet> {
    let competitionEntity = assert<ICompetitioinWithoutRelations>(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionUpdateDto.id },
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionEntity = assert<ICompetitioinWithoutRelations>({ ...competitionEntity, ...competitionUpdateDto });
    await this.competitionRepository.save(competitionEntity);
    return { competition: competitionEntity };
  }

  async findCompetitions(query: FindCompetitionsParam): Promise<FindCompetitionsRet> {
    const competitionEntites = assert<ICompetitionWithEarlybirdDiscountSnapshots[]>(
      await this.competitionRepository.findManyWithQueryOptions({
        ...query,
      }),
    );
    let ret: FindCompetitionsRet = { competitions: competitionEntites };
    if (competitionEntites.length === query.limit) ret = { ...ret, nextPage: query.page + 1 };
    return ret;
  }

  async getCompetition({ competitionId, status }: GetCompetitionParam): Promise<GetCompetitionRet> {
    const competitionEntity = assert<ICompetitionWithRelations>(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionId, status },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
          ],
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
      assert<ICompetitioinWithoutRelations>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: competitionId },
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
      assert<ICompetitionWithDivisions>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: competitionId },
            relations: ['divisions'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    const divisionModels = this.divisionFactory
      .createDivisions(competition.getId(), divisionPacks)
      .map((division): DivisionModel => {
        return new DivisionModel(division);
      });
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
    const earlybirdDiscountSnapshotEntity = this.competitionFactory.createEarlybirdDiscountSnapshot(
      earlybirdDiscountSnapshotCreateDto,
    );
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
    const combinationDiscountSnapshotEntity = this.competitionFactory.createCombinationDiscountSnapshot(
      combinationDiscountSnapshotCreateDto,
    );
    await this.combinationDiscountSnapshotRepository.save(combinationDiscountSnapshotEntity);
    return { combinationDiscountSnapshot: combinationDiscountSnapshotEntity };
  }

  async createRequiredAdditionalInfo({
    requiredAdditionalInfoCreateDto,
  }: CreateRequiredAdditionalInfoParam): Promise<createRequiredAdditionalInfoRet> {
    const competitionModel = new CompetitionModel(
      assert<ICompetitionWithRequiredAdditionalInfo>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: requiredAdditionalInfoCreateDto.competitionId },
            relations: ['requiredAdditionalInfos'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    const requiredAdditionalInfoModel = new RequiredAdditionalInfoModel(
      this.competitionFactory.createRequiredAdditionalInfo(requiredAdditionalInfoCreateDto),
    );
    competitionModel.addRequiredAdditionalInfo(requiredAdditionalInfoModel);
    const requiredAdditionalInfoEntity = requiredAdditionalInfoModel.toEntity();
    await this.requiredAdditionalInfoRepository.save(requiredAdditionalInfoEntity);
    return { requiredAdditionalInfo: requiredAdditionalInfoEntity };
  }

  async updateRequiredAdditionalInfo({ requiredAdditionalInfoUpdateDto }: UpdateRequiredAdditionalInfoParam) {
    const requiredAdditionalInfoEntity = assert<IRequiredAdditionalInfo>(
      await this.requiredAdditionalInfoRepository
        .findOneOrFail({
          where: {
            id: requiredAdditionalInfoUpdateDto.id,
            competitionId: requiredAdditionalInfoUpdateDto.competitionId,
          },
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Required Addtional Info not found');
        }),
    );
    const updatedRequiredAdditionalInfoEntity = assert<IRequiredAdditionalInfo>({
      ...requiredAdditionalInfoEntity,
      ...requiredAdditionalInfoUpdateDto,
    });
    await this.requiredAdditionalInfoRepository.save(updatedRequiredAdditionalInfoEntity);
    return { requiredAdditionalInfo: updatedRequiredAdditionalInfoEntity };
  }

  async deleteRequiredAdditionalInfo({
    competitionId,
    requiredAdditionalInfoId,
  }: DeleteRequiredAdditionalInfoParam): Promise<void> {
    await this.requiredAdditionalInfoRepository.delete({ id: requiredAdditionalInfoId, competitionId }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Required Addtional Info not found');
    });
  }
}
