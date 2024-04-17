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
  CreateDivisionsRes,
  CreateEarlybirdDiscountSnapshotReqBody,
  CreateEarlybirdDiscountSnapshotRes,
  FindCompetitionsReqQuery,
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
   * Query: FindCompetitionsReqQuery
   * - pageParam: 현제 페이지 번호입니다. 최초 요청 시에는 0을 사용합니다.
   * - limitParam: 한페이지에 표시할 데이터 갯수. 요청하지 않을시 10을 기본값으로 사용.
   * - dateFilter: 대회 날짜를 기준으로 필터링합니다. ex) '2023-04'.
   * - locationFilter: 대회가 열리는 위치로 필터링합니다. ex) 서울, 부산, 인천, 대구, 대전, 광주, 울산, 세종, 경기, 충북, 충남, 전남, 경북, 경남, 강원, 전북, 제주.
   * - selectFilter: 태그를 기준으로 필터링합니다. ex) ['간편결제', '얼리버드', '신청가능', '단독출전조정'].
   * - sortOption: 대회를 정렬하는 옵션입니다. ex) '일자순', '조회순', '마감임박순'.
   *
   * @tag a-5 competitions
   * @returns competitions
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findCompetitions(@TypedQuery() query: FindCompetitionsReqQuery): Promise<ResponseForm<FindCompetitionsRes>> {
    return createResponseForm(await this.competitionsAppService.findCompetitions({ ...query }));
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
      await this.competitionsAppService.updateCompetition({ updateCompetitionDto: { id, ...body } }),
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
