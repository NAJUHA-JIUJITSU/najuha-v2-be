import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../dto/request/update-compoetition.req.dto';
import { FindCompetitionsResDto } from '../dto/response/find-competitions.res.dto';
import { UpdateCompetitionStatusReqDto } from '../dto/request/update-competition-status.req.dto';
import { CreateDivisitonsReqDto } from '../dto/request/create-divisions.req.dto';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';

@Controller('admin/competitions')
export class AdminCompetitionsController {
  constructor(private readonly CompetitionsAppService: CompetitionsAppService) {}

  /**
   * a-5-1 create competition.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns created competition
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async createCompetition(@TypedBody() dto: CreateCompetitionReqDto): Promise<ResponseForm<CompetitionResDto>> {
    const ret = await this.CompetitionsAppService.createCompetition(dto);
    return createResponseForm(ret);
  }

  /**
   * a-5-2 find competitions.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns competitions
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findCompetitions(): Promise<ResponseForm<FindCompetitionsResDto>> {
    const competitions = await this.CompetitionsAppService.findCompetitions();
    return createResponseForm(competitions);
  }

  /**
   * a-5-3 get competition.
   * - RoleLevel: ADMIN.
   *
   * @tag a-5 competitions
   * @returns competition
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/:id')
  async findCompetition(@TypedParam('id') id: CompetitionEntity['id']): Promise<ResponseForm<CompetitionResDto>> {
    const competition = await this.CompetitionsAppService.getCompetition({ where: { id } });
    return createResponseForm(competition);
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
    @TypedParam('id') id: CompetitionEntity['id'],
    @TypedBody() dto: UpdateCompetitionReqDto,
  ): Promise<ResponseForm<CompetitionResDto>> {
    const ret = await this.CompetitionsAppService.updateCompetition(id, dto);
    return createResponseForm(ret);
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
    @TypedParam('id') id: CompetitionEntity['id'],
    @TypedBody() dto: UpdateCompetitionStatusReqDto,
  ): Promise<ResponseForm<CompetitionResDto>> {
    const ret = await this.CompetitionsAppService.updateCompetitionStatus(id, dto.status);
    return createResponseForm(ret);
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
    @TypedParam('id') id: CompetitionEntity['id'],
    @TypedBody() dto: CreateDivisitonsReqDto,
  ): Promise<ResponseForm<any>> {
    const ret = await this.CompetitionsAppService.createDivisions(id, dto);
    return createResponseForm(ret);
  }
}
