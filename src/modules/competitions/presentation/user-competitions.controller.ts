import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { ICompetition } from '../domain/interface/competition.interface';
import { FindCompetitionsReqQuery, FindCompetitionsRes, GetCompetitionRes } from './competitions.controller.dto';

@Controller('user/competitions')
export class UserCompetitionsController {
  constructor(private readonly competitionsAppService: CompetitionsAppService) {}

  /**
   * u-5-1 findCompetitions.
   * - RoleLevel: PUBLIC.
   * - ACTIVE 상태인 competition 들을 조회합니다.
   *
   * @tag u-5 competitions
   * @param query FindCompetitionsReqQuery
   * @returns competitions
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/')
  async findCompetitions(@TypedQuery() query: FindCompetitionsReqQuery): Promise<ResponseForm<FindCompetitionsRes>> {
    return createResponseForm(
      await this.competitionsAppService.findCompetitions({
        page: query.page ?? 0,
        limit: query.limit ?? 10,
        parsedDateFilter: query.dateFilter ? new Date(query.dateFilter) : new Date(),
        sortOption: query.sortOption ?? '일자순',
        locationFilter: query.locationFilter,
        selectFilter: query.selectFilter,
        status: 'ACTIVE',
      }),
    );
  }

  /**
   * u-5-2 getCompetition.
   * - RoleLevel: USER.
   * - ACTIVE 상태인 competition 을 조회합니다.
   *
   * @tag u-5 competitions
   * @returns competition
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/:competitionId')
  async getCompetition(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
  ): Promise<ResponseForm<GetCompetitionRes>> {
    return createResponseForm(await this.competitionsAppService.getCompetition({ competitionId, status: 'ACTIVE' }));
  }
}
