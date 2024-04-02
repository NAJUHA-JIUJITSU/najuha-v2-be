import { TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { CompetitionResDto } from '../dto/response/competition.res.dto';
import { FindCompetitionsResDto } from '../dto/response/find-competitions.res.dto';
import { ICompetition } from '../domain/structure/competition.interface';

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
  async findCompetitions(): Promise<ResponseForm<FindCompetitionsResDto>> {
    const competitions = await this.CompetitionsAppService.findCompetitions({ where: { status: 'ACTIVE' } });
    return createResponseForm({ competitions });
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
  ): Promise<ResponseForm<CompetitionResDto>> {
    const competition = await this.CompetitionsAppService.getCompetition({
      where: { id: competitionId, status: 'ACTIVE' },
    });
    return createResponseForm({ competition });
  }
}
