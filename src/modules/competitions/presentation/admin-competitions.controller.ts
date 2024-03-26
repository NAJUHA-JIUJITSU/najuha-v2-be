import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { CreateCompetitionReqDto } from '../structure/dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../structure/dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../structure/dto/request/update-compoetition.req.dto';
import { FindCompetitionsResDto } from '../structure/dto/response/find-competitions.res.dto';
import { UpdateCompetitionStatusReqDto } from '../structure/dto/request/update-competition-status.req.dto';
import { CreateDivisitonsReqDto } from '../structure/dto/request/create-divisions.req.dto';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { CreateCompetitionResDto } from '../structure/dto/response/create-competition.res.dto';
import { CreateEarlybirdDiscountSnapshotReqDto } from '../structure/dto/request/create-earlybird-discount-snapshot.req.dto';
import { CombinationDiscountSnapshot } from '../domain/entities/combination-discount-snapshot.entity';
import { CreateDivisionsResDto } from '../structure/dto/response/create-divisions.res.dto';
import { CreateEarlybirdDiscountSnapshotResDto } from '../structure/dto/response/create-earlybird-discount-snapshot.res.dto';
import { createCombinationDiscountSnapshotReqDto } from '../structure/dto/request/create-combination-discount-snapshot.req.dto';
import { CreateCombinationDiscountSnapshotResDto } from '../structure/dto/response/create-combination-discount-snapshot.res.dto';

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
  async createCompetition(@TypedBody() dto: CreateCompetitionReqDto): Promise<ResponseForm<CreateCompetitionResDto>> {
    const competition = await this.competitionsAppService.createCompetition(dto);
    return createResponseForm({ competition });
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
  async findCompetitions(): Promise<ResponseForm<FindCompetitionsResDto>> {
    const competitions = await this.competitionsAppService.findCompetitions();
    return createResponseForm({
      competitions,
    });
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
  async findCompetition(@TypedParam('id') id: Competition['id']): Promise<ResponseForm<CompetitionResDto>> {
    const competition = await this.competitionsAppService.getCompetition({ where: { id } });
    return createResponseForm({ competition });
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
    @TypedParam('id') id: Competition['id'],
    @TypedBody() dto: UpdateCompetitionReqDto,
  ): Promise<ResponseForm<CompetitionResDto>> {
    const competition = await this.competitionsAppService.updateCompetition(id, dto);
    return createResponseForm({ competition });
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
    @TypedParam('id') id: Competition['id'],
    @TypedBody() dto: UpdateCompetitionStatusReqDto,
  ): Promise<ResponseForm<CompetitionResDto>> {
    const competition = await this.competitionsAppService.updateCompetitionStatus(id, dto.status);
    return createResponseForm({ competition });
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
    @TypedParam('id') id: Competition['id'],
    @TypedBody() dto: CreateDivisitonsReqDto,
  ): Promise<ResponseForm<CreateDivisionsResDto>> {
    const divisions = await this.competitionsAppService.createDivisions(id, dto);
    return createResponseForm({
      divisions,
    });
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
    @TypedParam('id') id: Competition['id'],
    @TypedBody() dto: CreateEarlybirdDiscountSnapshotReqDto,
  ): Promise<ResponseForm<CreateEarlybirdDiscountSnapshotResDto>> {
    const earlybirdDiscountSnapshot = await this.competitionsAppService.createEarlybirdDiscountSnapshot(id, dto);
    return createResponseForm({
      earlybirdDiscountSnapshot,
    });
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
    @TypedParam('id') id: Competition['id'],
    @TypedBody() dto: createCombinationDiscountSnapshotReqDto,
  ): Promise<ResponseForm<CreateCombinationDiscountSnapshotResDto>> {
    const combinationDiscountSnapshot = await this.competitionsAppService.createCombinationDiscountSnapshot(id, dto);
    return createResponseForm({
      combinationDiscountSnapshot,
    });
  }
}
