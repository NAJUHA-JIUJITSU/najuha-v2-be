import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import {
  CreateCombinationDiscountSnapshotReqBody,
  CreateCombinationDiscountSnapshotRes,
  CreateCompetitionReqBody,
  CreateCompetitionRes,
  CreateDivisionsReqBody,
  CreateCompetitionDivisionsRes,
  CreateEarlybirdDiscountSnapshotReqBody,
  CreateEarlybirdDiscountSnapshotRes,
  CreateCompetitionRequiredAdditionalInfoReqBody,
  FindCompetitionsReqQuery,
  FindCompetitionsRes,
  UpdateCompetitionReqBody,
  UpdateCompetitionRes,
  UpdateCompetitionStatusReqBody,
  UpdateRequiredAdditionalInfoReqBody,
  CreateCompetitionRequiredAdditionalInfoRes,
  DeleteCompetitionRequiredAdditionalInfoRes,
  UpdateCompetitionRequiredAdditionalInfoRes,
  GetCompetitionRes,
  CreateCompetitionPosterImageReqBody,
  CreateCompetitionPosterImageRes,
} from './competitions.controller.dto';
import { ICompetition } from '../domain/interface/competition.interface';
import { IRequiredAdditionalInfo } from '../domain/interface/required-addtional-info.interface';

@Controller('admin/competitions')
export class AdminCompetitionsController {
  constructor(private readonly competitionsAppService: CompetitionsAppService) {}

  /**
   * a-5-1 createCompetition.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param body CreateCompetitionReqBody
   * @returns CreateCompetitionRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async createCompetition(@TypedBody() body: CreateCompetitionReqBody): Promise<ResponseForm<CreateCompetitionRes>> {
    return createResponseForm(await this.competitionsAppService.createCompetition({ competitionCreateDto: body }));
  }

  /**
   * a-5-2 findCompetitions.
   * - RoleLevel: ADMIN.
   * - ACTIVE, INACTIVE 상태인 competition 들을 조회합니다.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param query FindCompetitionsReqQuery
   * @returns FindCompetitionsRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findCompetitions(@TypedQuery() query: FindCompetitionsReqQuery): Promise<ResponseForm<FindCompetitionsRes>> {
    return createResponseForm(
      await this.competitionsAppService.findCompetitions({
        page: query.page || 0,
        limit: query.limit || 10,
        parsedDateFilter: query.dateFilter ? new Date(query.dateFilter) : new Date(),
        sortOption: query.sortOption ?? '일자순',
        locationFilter: query.locationFilter,
        selectFilter: query.selectFilter,
      }),
    );
  }

  /**
   * a-5-3 getCompetition.
   * - RoleLevel: ADMIN.
   * - ACTIVE, INACTIVE 상태인 competition 을 조회합니다.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @returns GetCompetitionRes
   *
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/:competitionId')
  async getCompetition(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
  ): Promise<ResponseForm<GetCompetitionRes>> {
    return createResponseForm(await this.competitionsAppService.getCompetition({ competitionId }));
  }

  /**
   * a-5-4 updateCompetition.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param body UpdateCompetitionReqBody
   * @returns UpdateCompetitionRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:competitionId')
  async updateCompetition(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: UpdateCompetitionReqBody,
  ): Promise<ResponseForm<UpdateCompetitionRes>> {
    return createResponseForm(
      await this.competitionsAppService.updateCompetition({ competitionUpdateDto: { id: competitionId, ...body } }),
    );
  }

  /**
   * a-5-5 updateCompetitionStatus.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param body UpdateCompetitionStatusReqBody
   * @returns UpdateCompetitionRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:competitionId/status')
  async updateCompetitionStatus(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: UpdateCompetitionStatusReqBody,
  ): Promise<ResponseForm<UpdateCompetitionRes>> {
    return createResponseForm(
      await this.competitionsAppService.updateCompetitionStatus({
        competitionId,
        status: body.status,
      }),
    );
  }

  /**
   * a-5-6 createCompetitionDivisions.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param body CreateDivisionsReqBody
   * @returns CreateCompetitionDivisionsRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/divisions')
  async createCompetitionDivisions(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: CreateDivisionsReqBody,
  ): Promise<ResponseForm<CreateCompetitionDivisionsRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionDivisions({
        competitionId,
        divisionPacks: body.divisionPacks,
      }),
    );
  }

  /**
   * a-5-7 createCompetitionEarlybirdDiscountSnapshot.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param body CreateEarlybirdDiscountSnapshotReqBody
   * @returns CreateEarlybirdDiscountSnapshotRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/earlybird-discount-snapshots')
  async createCompetitionEarlybirdDiscountSnapshot(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: CreateEarlybirdDiscountSnapshotReqBody,
  ): Promise<ResponseForm<CreateEarlybirdDiscountSnapshotRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionEarlybirdDiscountSnapshot({
        earlybirdDiscountSnapshotCreateDto: { competitionId, ...body },
      }),
    );
  }

  /**
   * a-5-8 createCombinationDiscountSnapshot.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param body CreateCombinationDiscountSnapshotReqBody
   * @returns CreateCombinationDiscountSnapshotRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/combination-discount-snapshots')
  async createCombinationDiscountSnapshot(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: CreateCombinationDiscountSnapshotReqBody,
  ): Promise<ResponseForm<CreateCombinationDiscountSnapshotRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionCombinationDiscountSnapshot({
        combinationDiscountSnapshotCreateDto: { competitionId, ...body },
      }),
    );
  }

  /**
   * a-5-9 createCompetitionRequiredAdditionalInfo.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param body CreateCompetitionRequiredAdditionalInfoReqBody
   * @returns CreateCompetitionRequiredAdditionalInfoRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/required-additional-infos')
  async createCompetitionRequiredAdditionalInfo(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: CreateCompetitionRequiredAdditionalInfoReqBody,
  ): Promise<ResponseForm<CreateCompetitionRequiredAdditionalInfoRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionRequiredAdditionalInfo({
        requiredAdditionalInfoCreateDto: { competitionId, ...body },
      }),
    );
  }

  /**
   * a-5-10 updateRequiredAdditionalInfo.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param requiredAdditionalInfoId requiredAdditionalInfoId
   * @param body UpdateRequiredAdditionalInfoReqBody
   * @returns UpdateCompetitionRequiredAdditionalInfoRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:competitionId/required-additional-infos/:requiredAdditionalInfoId')
  async updateRequiredAdditionalInfo(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedParam('requiredAdditionalInfoId') requiredAdditionalInfoId: IRequiredAdditionalInfo['id'],
    @TypedBody() body: UpdateRequiredAdditionalInfoReqBody,
  ): Promise<ResponseForm<UpdateCompetitionRequiredAdditionalInfoRes>> {
    return createResponseForm(
      await this.competitionsAppService.updateCompetitionRequiredAdditionalInfo({
        requiredAdditionalInfoUpdateDto: { competitionId, id: requiredAdditionalInfoId, ...body },
      }),
    );
  }

  /**
   * a-5-11 deleteRequiredAdditionalInfo.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @security bearer
   * @param competitionId competitionId
   * @param requiredAdditionalInfoId requiredAdditionalInfoId
   * @returns DeleteCompetitionRequiredAdditionalInfoRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Delete('/:competitionId/required-additional-infos/:requiredAdditionalInfoId')
  async deleteRequiredAdditionalInfo(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedParam('requiredAdditionalInfoId') requiredAdditionalInfoId: IRequiredAdditionalInfo['id'],
  ): Promise<ResponseForm<DeleteCompetitionRequiredAdditionalInfoRes>> {
    return createResponseForm(
      await this.competitionsAppService.deleteCompetitionRequiredAdditionalInfo({
        competitionId,
        requiredAdditionalInfoId,
      }),
    );
  }

  /**
   * a-5-12 createCompetitionPosterImage.
   * - RoleLevel: ADMIN.
   * - 대회 포스터 이미지를 생성 및 업데이트합니다.
   * - 이미지가 존재할 경우, 기존 이미지는 soft delete 처리되고 새로운 이미지가 생성됩니다.
   *
   * @tag a-5 competitions
   * @security bearer
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/poster-image')
  async createCompetitionPosterImage(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() body: CreateCompetitionPosterImageReqBody,
  ): Promise<ResponseForm<CreateCompetitionPosterImageRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionPosterImage({
        competitionPosterImageCreateDto: {
          competitionId,
          imageId: body.imageId,
        },
      }),
    );
  }
}
