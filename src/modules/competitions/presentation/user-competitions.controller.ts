import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { ICompetition } from '../domain/interface/competition.interface';
import { FindCompetitionsReqQuery, FindCompetitionsRes, GetCompetitionRes } from './dtos';

@Controller('user/competitions')
export class UserCompetitionsController {
  constructor(private readonly CompetitionsAppService: CompetitionsAppService) {}

  /**
   * u-5-1 find competitions.
   * - RoleLevel: USER.
   * - ACTIVE 상태인 competition 들을 조회합니다.
   *
   * Query: FindCompetitionsReqQuery
   * - page: 현제 페이지 번호입니다. 최초 요청 시에는 0을 사용합니다.
   * - limit: 한페이지에 표시할 데이터 갯수. 요청하지 않을시 10을 기본값으로 사용.
   * - dateFilter: 대회 날짜를 기준으로 필터링합니다. ex) '2023-04'.
   * - locationFilter: 대회가 열리는 위치로 필터링합니다. ex) 서울, 부산, 인천, 대구, 대전, 광주, 울산, 세종, 경기, 충북, 충남, 전남, 경북, 경남, 강원, 전북, 제주.
   * - selectFilter: 태그를 기준으로 필터링합니다. ex) ['간편결제', '얼리버드', '신청가능', '단독출전조정'].
   * - sortOption: 대회를 정렬하는 옵션입니다. ex) '일자순', '조회순', '마감임박순'.
   *
   * @tag u-5 competitions
   * @returns competitions
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/')
  async findCompetitions(@TypedQuery() query: FindCompetitionsReqQuery): Promise<ResponseForm<FindCompetitionsRes>> {
    return createResponseForm(await this.CompetitionsAppService.findCompetitions({ ...query, status: 'ACTIVE' }));
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
