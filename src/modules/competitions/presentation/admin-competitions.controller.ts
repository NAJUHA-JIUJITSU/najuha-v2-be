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
   * @returns created competition
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
   * @param query FindCompetitionsReqQuery
   * @returns competitions
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
   * @returns competition
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
   * @returns updated competition
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
   * @returns updated competition
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
   * @returns created divisions
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
   * @returns created earlybird discount snapshot
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
   * @returns created combination discount snapshot
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/combination-discount-snapshots')
  async createCombinationDiscountSnapshot(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() dto: CreateCombinationDiscountSnapshotReqBody,
  ): Promise<ResponseForm<CreateCombinationDiscountSnapshotRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionCombinationDiscountSnapshot({
        combinationDiscountSnapshotCreateDto: { competitionId, ...dto },
      }),
    );
  }

  /**
   * a-5-9 createCompetitionRequiredAdditionalInfo.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns created required addtional info
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:competitionId/required-additional-infos')
  async createCompetitionRequiredAdditionalInfo(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedBody() dto: CreateCompetitionRequiredAdditionalInfoReqBody,
  ): Promise<ResponseForm<CreateCompetitionRequiredAdditionalInfoRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCompetitionRequiredAdditionalInfo({
        requiredAdditionalInfoCreateDto: { competitionId, ...dto },
      }),
    );
  }

  /**
   * a-5-10 updateRequiredAdditionalInfo.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns updated required addtional info
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:competitionId/required-additional-infos/:requiredAdditionalInfoId')
  async updateRequiredAdditionalInfo(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
    @TypedParam('requiredAdditionalInfoId') requiredAdditionalInfoId: IRequiredAdditionalInfo['id'],
    @TypedBody() dto: UpdateRequiredAdditionalInfoReqBody,
  ): Promise<ResponseForm<UpdateCompetitionRequiredAdditionalInfoRes>> {
    return createResponseForm(
      await this.competitionsAppService.updateCompetitionRequiredAdditionalInfo({
        requiredAdditionalInfoUpdateDto: { competitionId, id: requiredAdditionalInfoId, ...dto },
      }),
    );
  }

  /**
   * a-5-11 deleteRequiredAdditionalInfo.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns void
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
}
