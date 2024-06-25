import { Injectable } from '@nestjs/common';
import {
  CreateCombinationDiscountSnapshotParam,
  CreateCompetitionCombinationDiscountSnapshotRet,
  CreateCompetitionParam,
  CreateCompetitionRet,
  CreateDivisionsParam,
  CreateEarlybirdDiscountSnapshotParam,
  CreateCompetitionEarlybirdDiscountSnapshotRet,
  FindCompetitionsParam,
  FindCompetitionsRet,
  GetCompetitionParam,
  GetCompetitionRet,
  UpdateCompetitionParam,
  UpdateCompetitionRet,
  UpdateCompetitionStatusParam,
  CreateCompetitionRequiredAdditionalInfoParam,
  CreateCompetitionRequiredAdditionalInfoRet,
  UpdateCompetitionRequiredAdditionalInfoParam,
  DeleteRequiredAdditionalInfoParam,
  UpdateCompetitionStatusRet,
  CreateCompetitionDivisionsRet,
  UpdateCompetitionRequiredAdditionalInfoRet,
  DeleteCompetitionRequiredAdditionalInfoRet,
  CreateCompetitionPosterImageParam,
  CreateCompetitionPosterImageRet,
  DeleteCompetitionPosterImageParam,
} from './competitions.app.dto';
import { CompetitionModel } from '../domain/model/competition.model';
import { BusinessException, CommonErrors } from '../../../common/response/errorResponse';
import { CompetitionFactory } from '../domain/competition.factory';
import { CompetitionRepository } from '../../../database/custom-repository/competition.repository';
import { DivisionFactory } from '../domain/division.factory';
import { RequiredAdditionalInfoModel } from '../domain/model/required-addtional-info.model';
import { EarlybirdDiscountSnapshotModel } from '../domain/model/earlybird-discount-snapshot.model';
import { CombinationDiscountSnapshotModel } from '../domain/model/combination-discount-snapshot.model';
import { assert } from 'typia';
import { ImageRepository } from '../../../database/custom-repository/image.repository';
import { DivisionModel } from '../domain/model/division.model';
import { CompetitionPosterImageModel } from '../domain/model/competition-poster-image.model';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly divisionFactory: DivisionFactory,
    private readonly competitionFactory: CompetitionFactory,
    private readonly competitionRepository: CompetitionRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async createCompetition({ competitionCreateDto }: CreateCompetitionParam): Promise<CreateCompetitionRet> {
    const competitionModel = new CompetitionModel(this.competitionFactory.createCompetition(competitionCreateDto));
    return assert<CreateCompetitionRet>({
      competition: await this.competitionRepository.save(competitionModel.toData()),
    });
  }

  async updateCompetition({ competitionUpdateDto }: UpdateCompetitionParam): Promise<UpdateCompetitionRet> {
    const competition = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionUpdateDto.id },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch((e) => {
          console.log(e);
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competition.update(competitionUpdateDto);
    return assert<UpdateCompetitionRet>({ competition: await this.competitionRepository.save(competition.toData()) });
  }

  async updateCompetitionStatus({
    competitionId,
    status,
  }: UpdateCompetitionStatusParam): Promise<UpdateCompetitionStatusRet> {
    const competition = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competition.updateStatus(status);
    return assert<UpdateCompetitionStatusRet>({
      competition: await this.competitionRepository.save(competition.toData()),
    });
  }

  async findCompetitions(query: FindCompetitionsParam): Promise<FindCompetitionsRet> {
    const competitionEntites = await this.competitionRepository.findManyWithQueryOptions({
      ...query,
    });
    const ret = assert<FindCompetitionsRet>({ competitions: competitionEntites });
    if (competitionEntites.length === query.limit) ret.nextPage = query.page + 1;
    return ret;
  }

  async getCompetition(query: GetCompetitionParam): Promise<GetCompetitionRet> {
    const competitionEntity = await this.competitionRepository.findOneWithQueryOptions({
      ...query,
    });
    return assert<GetCompetitionRet>({ competition: competitionEntity });
  }

  async createCompetitionDivisions({
    competitionId,
    divisionPacks,
  }: CreateDivisionsParam): Promise<CreateCompetitionDivisionsRet> {
    const competition = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    const divisionModels = this.divisionFactory.createDivisions(competition.getId(), divisionPacks).map((division) => {
      return new DivisionModel(division);
    });
    competition.addDivisions(divisionModels);
    return assert<CreateCompetitionDivisionsRet>({
      competition: await this.competitionRepository.save(competition.toData()),
    });
  }

  async createCompetitionEarlybirdDiscountSnapshot({
    earlybirdDiscountSnapshotCreateDto,
  }: CreateEarlybirdDiscountSnapshotParam): Promise<CreateCompetitionEarlybirdDiscountSnapshotRet> {
    const competitionModel = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: earlybirdDiscountSnapshotCreateDto.competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionModel.addEarlybirdDiscountSnapshot(
      new EarlybirdDiscountSnapshotModel(
        this.competitionFactory.createEarlybirdDiscountSnapshot(earlybirdDiscountSnapshotCreateDto),
      ),
    );
    return assert<CreateCompetitionEarlybirdDiscountSnapshotRet>({
      competition: await this.competitionRepository.save(competitionModel.toData()),
    });
  }

  async createCompetitionCombinationDiscountSnapshot({
    combinationDiscountSnapshotCreateDto,
  }: CreateCombinationDiscountSnapshotParam): Promise<CreateCompetitionCombinationDiscountSnapshotRet> {
    const competitionModel = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: combinationDiscountSnapshotCreateDto.competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionModel.addCombinationDiscountSnapshot(
      new CombinationDiscountSnapshotModel(
        this.competitionFactory.createCombinationDiscountSnapshot(combinationDiscountSnapshotCreateDto),
      ),
    );
    return assert<CreateCompetitionCombinationDiscountSnapshotRet>({
      competition: await this.competitionRepository.save(competitionModel.toData()),
    });
  }

  async createCompetitionRequiredAdditionalInfo({
    requiredAdditionalInfoCreateDto,
  }: CreateCompetitionRequiredAdditionalInfoParam): Promise<CreateCompetitionRequiredAdditionalInfoRet> {
    const competitionModel = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: requiredAdditionalInfoCreateDto.competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionModel.addRequiredAdditionalInfo(
      new RequiredAdditionalInfoModel(
        this.competitionFactory.createRequiredAdditionalInfo(requiredAdditionalInfoCreateDto),
      ),
    );
    return assert<CreateCompetitionRequiredAdditionalInfoRet>({
      competition: await this.competitionRepository.save(competitionModel.toData()),
    });
  }

  async updateCompetitionRequiredAdditionalInfo({
    requiredAdditionalInfoUpdateDto,
  }: UpdateCompetitionRequiredAdditionalInfoParam): Promise<UpdateCompetitionRequiredAdditionalInfoRet> {
    const competitionModel = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: requiredAdditionalInfoUpdateDto.competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionModel.updateRequiredAdditionalInfo(requiredAdditionalInfoUpdateDto);
    return assert<UpdateCompetitionRequiredAdditionalInfoRet>({
      competition: await this.competitionRepository.save(competitionModel.toData()),
    });
  }

  async deleteCompetitionRequiredAdditionalInfo({
    competitionId,
    requiredAdditionalInfoId,
  }: DeleteRequiredAdditionalInfoParam): Promise<DeleteCompetitionRequiredAdditionalInfoRet> {
    const competitionModel = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competitionModel.deleteRequiredAdditionalInfo(requiredAdditionalInfoId);
    return assert<DeleteCompetitionRequiredAdditionalInfoRet>({
      competition: await this.competitionRepository.save(competitionModel.toData()),
    });
  }

  async createCompetitionPosterImage({
    competitionPosterImageCreateDto,
  }: CreateCompetitionPosterImageParam): Promise<CreateCompetitionPosterImageRet> {
    const [competitionEntity, imageEntity] = await Promise.all([
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionPosterImageCreateDto.competitionId },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
            'competitionPosterImages',
            'competitionPosterImages.image',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
      await this.imageRepository
        .findOneOrFail({ where: { id: competitionPosterImageCreateDto.imageId, path: 'competition' } })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Image not found');
        }),
    ]);
    const competition = new CompetitionModel(competitionEntity);
    const competitionPosterImage = new CompetitionPosterImageModel(
      this.competitionFactory.createCompetitionPosterImage(competitionPosterImageCreateDto, imageEntity),
    );
    competition.updatePosterImage(competitionPosterImage);
    return assert<CreateCompetitionPosterImageRet>({
      competition: await this.competitionRepository.save(competition.toData()),
    });
  }

  async deleteCompetitionPosterImage({ competitionId }: DeleteCompetitionPosterImageParam): Promise<void> {
    const competition = new CompetitionModel(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: competitionId },
          relations: ['competitionPosterImages', 'competitionPosterImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    competition.deletePosterImage();
    await this.competitionRepository.save(competition.toData());
  }

  // todo:!!!:  createCompetitionHost
}
