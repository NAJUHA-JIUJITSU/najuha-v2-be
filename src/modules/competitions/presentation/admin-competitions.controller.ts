import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../dto/response/competition.res.dto';

@Controller('admin/competitions')
export class AdminCompetitionsController {
  constructor(private readonly CompetitionsAppService: CompetitionsAppService) {}

  /**
   * u-5-1 create competition
   * - RoleLevel: ADMIN
   *
   * @tag u-5 competitions
   * @returns created competition info
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async createCompetition(@TypedBody() dto: CreateCompetitionReqDto): Promise<ResponseForm<CompetitionResDto>> {
    const ret = await this.CompetitionsAppService.createCompetition(dto);
    return createResponseForm(ret);
  }
}
