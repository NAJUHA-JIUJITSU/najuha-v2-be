import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { ICompetition } from '../domain/interface/competition.interface';
import { FindCompetitionsReqQuery, FindCompetitionsRes, GetCompetitionRes } from './competitions.controller.dto';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

@Controller('host/competitions')
export class HostCompetitionsController {
  constructor(private readonly competitionsAppService: CompetitionsAppService) {}

  /**
   * h-5-1 findCompetitions.
   * - RoleLevel: HOST.
   * - 본인이 주최한 대회들을 조회합니다.
   * - ACTIVE, INACTIVE 상태인 competition 들을 조회합니다.
   *
   *
   * @tag h-5 competitions
   * @param query FindCompetitionsReqQuery
   * @returns hosting competitions
   */
  @RoleLevels(RoleLevel.HOST)
  @TypedRoute.Get('/')
  async findCompetitions(
    @Req() req: Request,
    @TypedQuery() query: FindCompetitionsReqQuery,
  ): Promise<ResponseForm<FindCompetitionsRes>> {
    const userId: IUser['id'] = req['userId'];
    return createResponseForm(
      await this.competitionsAppService.findCompetitions({
        hostId: userId,
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
   * h-5-2 getCompetition.
   * - RoleLevel: HOST.
   * - 본인이 주최한 대회를 조회합니다.
   * - ACTIVE, INACTIVE 상태인 competition을 조회합니다.
   *
   * @tag h-5 competitions
   * @returns competition
   */
  @RoleLevels(RoleLevel.HOST)
  @TypedRoute.Get('/:competitionId')
  async getCompetition(
    @TypedParam('competitionId') competitionId: ICompetition['id'],
  ): Promise<ResponseForm<GetCompetitionRes>> {
    return createResponseForm(await this.competitionsAppService.getCompetition({ competitionId }));
  }
}
