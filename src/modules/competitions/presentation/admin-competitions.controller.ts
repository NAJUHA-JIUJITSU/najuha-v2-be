import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
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
  CreateDivisionsRes,
  CreateEarlybirdDiscountSnapshotReqBody,
  CreateEarlybirdDiscountSnapshotRes,
  FindCompetitionsRes,
  UpdateCompetitionReqBody,
  UpdateCompetitionRes,
  UpdateCompetitionStatusReqBody,
} from './dtos';
import { ICompetition } from '../domain/interface/competition.interface';
import { GetCompetitionRet } from '../application/dtos';

@Controller('admin/competitions')
export class AdminCompetitionsController {
  constructor(private readonly competitionsAppService: CompetitionsAppService) {}

  /**
   * a-5-1 create competition.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns created competition
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async createCompetition(@TypedBody() body: CreateCompetitionReqBody): Promise<ResponseForm<CreateCompetitionRes>> {
    return createResponseForm(await this.competitionsAppService.createCompetition({ creatCompetitionDto: body }));
  }

  /**
   * a-5-2 find competitions.
   * - RoleLevel: ADMIN.
   * - ACTIVE, INACTIVE 상태인 competition 들을 조회합니다.
   *
   * @tag a-5 competitions
   * @returns competitions
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findCompetitions(): Promise<ResponseForm<FindCompetitionsRes>> {
    return createResponseForm(await this.competitionsAppService.findCompetitions());
  }

  /**
   * a-5-3 get competition.
   * - RoleLevel: ADMIN.
   * - ACTIVE, INACTIVE 상태인 competition 을 조회합니다.
   *
   * @tag a-5 competitions
   * @returns competition
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/:id')
  async findCompetition(@TypedParam('id') id: ICompetition['id']): Promise<ResponseForm<GetCompetitionRet>> {
    return createResponseForm(await this.competitionsAppService.getCompetition({ competitionId: id }));
  }

  /**
   * a-5-4 update competition.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns updated competition
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:id')
  async updateCompetition(
    @TypedParam('id') id: ICompetition['id'],
    @TypedBody() body: UpdateCompetitionReqBody,
  ): Promise<ResponseForm<UpdateCompetitionRes>> {
    return createResponseForm(
      await this.competitionsAppService.updateCompetition({ updateCompetition: { id, ...body } }),
    );
  }

  /**
   * a-5-5 update competition status.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns updated competition
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:id/status')
  async updateCompetitionStatus(
    @TypedParam('id') id: ICompetition['id'],
    @TypedBody() body: UpdateCompetitionStatusReqBody,
  ): Promise<ResponseForm<UpdateCompetitionRes>> {
    return createResponseForm(
      await this.competitionsAppService.updateCompetitionStatus({
        competitionId: id,
        status: body.status,
      }),
    );
  }

  /**
   * a-5-6 create divisions.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns created divisions
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:id/divisions')
  async createDivisions(
    @TypedParam('id') id: ICompetition['id'],
    @TypedBody() body: CreateDivisionsReqBody,
  ): Promise<ResponseForm<CreateDivisionsRes>> {
    return createResponseForm(
      await this.competitionsAppService.createDivisions({ competitionId: id, divisionPacks: body.divisionPacks }),
    );
  }

  /**
   * a-5-7 create earlybird discount snapshot.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns created earlybird discount snapshot
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:id/earlybird-discount-snapshots')
  async createEarlybirdDiscountSnapshot(
    @TypedParam('id') id: ICompetition['id'],
    @TypedBody() body: CreateEarlybirdDiscountSnapshotReqBody,
  ): Promise<ResponseForm<CreateEarlybirdDiscountSnapshotRes>> {
    return createResponseForm(
      await this.competitionsAppService.createEarlybirdDiscountSnapshot({
        competitionId: id,
        earlybirdDiscount: body,
      }),
    );
  }

  /**
   * a-5-8 create combination discount snapshot.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns created combination discount snapshot
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/:id/combination-discount-snapshots')
  async createCombinationDiscountSnapshot(
    @TypedParam('id') id: ICompetition['id'],
    @TypedBody() dto: CreateCombinationDiscountSnapshotReqBody,
  ): Promise<ResponseForm<CreateCombinationDiscountSnapshotRes>> {
    return createResponseForm(
      await this.competitionsAppService.createCombinationDiscountSnapshot({
        competitionId: id,
        combinationDiscount: dto,
      }),
    );
  }
}
