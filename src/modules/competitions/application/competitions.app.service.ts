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
  CreateRequiredAddtionalInfoParam,
  createRequiredAddtionalInfoRet,
  DeleteRequiredAddtionalInfoParam,
  UpdateRequiredAddtionalInfoParam,
} from './dtos';
import { CompetitionModel } from '../domain/model/competition.model';
import { assert } from 'typia';
import {
  ICompetitioinWithoutRelations,
  ICompetitionWithDivisions,
  ICompetitionWithEarlybirdDiscountSnapshots,
  ICompetitionWithRelations,
  ICompetitionWithRequiredAddtionalInfo,
} from '../domain/interface/competition.interface';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { CompetitionFactory } from '../domain/competition.factory';
import { CompetitionRepository } from 'src/infrastructure/database/custom-repository/competition.repository';
import { DivisionRepository } from 'src/infrastructure/database/custom-repository/division.repository';
import { EarlybirdDiscountSnapshotRepository } from 'src/infrastructure/database/custom-repository/earlybird-discount-snapshot.repository';
import { CombinationDiscountSnapshotRepository } from 'src/infrastructure/database/custom-repository/combination-discount-snapshot.repository';
import { RequiredAddtionalInfoRepository } from 'src/infrastructure/database/custom-repository/required-addtional-info.repository';
import { IRequiredAddtionalInfo } from '../domain/interface/required-addtional-info.interface';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly divisionFactory: DivisionFactory,
    private readonly competitionFactory: CompetitionFactory,
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionRepository: DivisionRepository,
    private readonly earlybirdDiscountSnapshotRepository: EarlybirdDiscountSnapshotRepository,
    private readonly combinationDiscountSnapshotRepository: CombinationDiscountSnapshotRepository,
    private readonly requiredAddtionalInfoRepository: RequiredAddtionalInfoRepository,
  ) {}

  async createCompetition({ competitionCreateDto }: CreateCompetitionParam): Promise<CreateCompetitionRet> {
    const competitionModel = this.competitionFactory.createCompetition(competitionCreateDto);
    const competitionEntity = competitionModel.toEntity();
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
    const nextPage = competitionEntites.length === query.limit ? query.page + 1 : null;
    return { competitions: competitionEntites, nextPage };
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
            'requiredAddtionalInfos',
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

  async createRequiredAddtionalInfo({
    requiredAddtionalInfoCreateDto,
  }: CreateRequiredAddtionalInfoParam): Promise<createRequiredAddtionalInfoRet> {
    const competitionModel = new CompetitionModel(
      assert<ICompetitionWithRequiredAddtionalInfo>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: requiredAddtionalInfoCreateDto.competitionId },
            relations: ['requiredAddtionalInfos'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    const requiredAddtionalInfoModel =
      this.competitionFactory.createRequiredAddtionalInfo(requiredAddtionalInfoCreateDto);
    competitionModel.addRequiredAddtionalInfo(requiredAddtionalInfoModel);
    const requiredAddtionalInfoEntity = requiredAddtionalInfoModel.toEntity();
    await this.requiredAddtionalInfoRepository.save(requiredAddtionalInfoEntity);
    return { requiredAddtionalInfo: requiredAddtionalInfoEntity };
  }

  async updateRequiredAddtionalInfo({ requiredAddtionalInfoUpdateDto }: UpdateRequiredAddtionalInfoParam) {
    const requiredAddtionalInfoEntity = assert<IRequiredAddtionalInfo>(
      await this.requiredAddtionalInfoRepository
        .findOneOrFail({
          where: { id: requiredAddtionalInfoUpdateDto.id, competitionId: requiredAddtionalInfoUpdateDto.competitionId },
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Required Addtional Info not found');
        }),
    );
    const updatedRequiredAddtionalInfoEntity = assert<IRequiredAddtionalInfo>({
      ...requiredAddtionalInfoEntity,
      ...requiredAddtionalInfoUpdateDto,
    });
    await this.requiredAddtionalInfoRepository.save(updatedRequiredAddtionalInfoEntity);
    return { requiredAddtionalInfo: updatedRequiredAddtionalInfoEntity };
  }

  async deleteRequiredAddtionalInfo({
    competitionId,
    requiredAddtionalInfoId,
  }: DeleteRequiredAddtionalInfoParam): Promise<void> {
    await this.requiredAddtionalInfoRepository.delete({ id: requiredAddtionalInfoId, competitionId }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Required Addtional Info not found');
    });
  }
}
