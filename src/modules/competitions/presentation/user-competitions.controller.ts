import { TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { CompetitionResDto } from '../structure/dto/response/competition.res.dto';
import { FindCompetitionsResDto } from '../structure/dto/response/find-competitions.res.dto';
import { ICompetition } from '../structure/competition.interface';

@Controller('user/competitions')
export class UserCompetitionsController {
  constructor(private readonly CompetitionsAppService: CompetitionsAppService) {}

  /**
   * u-5-1 find competitions.
   * - RoleLevel: USER.
   *
   * @tag u-5 competitions
   * @returns competitions
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/')
  async findCompetitions(): Promise<ResponseForm<FindCompetitionsResDto>> {
    const competitions = await this.CompetitionsAppService.findCompetitions({ where: { status: 'ACTIVE' } });
    return createResponseForm(competitions);
  }

  /**
   * u-5-2 get competition.
   * - RoleLevel: USER.
   *
   * @tag u-5 competitions
   * @returns competition
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:id')
  async getCompetition(@TypedParam('id') id: ICompetition['id']): Promise<ResponseForm<CompetitionResDto>> {
    const competition = await this.CompetitionsAppService.getCompetition({ where: { id, status: 'ACTIVE' } });
    return createResponseForm(competition);
  }
}
