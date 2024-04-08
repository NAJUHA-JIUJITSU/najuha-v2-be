import { TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { ICompetition } from '../domain/interface/competition.interface';
import { FindCompetitionsRes, GetCompetitionRes } from './dtos';

@Controller('user/competitions')
export class UserCompetitionsController {
  constructor(private readonly CompetitionsAppService: CompetitionsAppService) {}

  /**
   * u-5-1 find competitions.
   * - RoleLevel: USER.
   * - ACTIVE 상태인 competition 들을 조회합니다.
   *
   * @tag u-5 competitions
   * @returns competitions
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/')
  async findCompetitions(): Promise<ResponseForm<FindCompetitionsRes>> {
    return createResponseForm(await this.CompetitionsAppService.findCompetitions({ status: 'ACTIVE' }));
  }

  /**
   * u-5-2 get competition.
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
    return createResponseForm(await this.CompetitionsAppService.getCompetition({ competitionId, status: 'ACTIVE' }));
  }
}
