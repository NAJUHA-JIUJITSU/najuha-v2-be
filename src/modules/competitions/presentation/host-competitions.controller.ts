import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CompetitionsAppService } from '../application/competitions.app.service';
import { ICompetition } from '../domain/interface/competition.interface';
import { FindCompetitionsReqQuery, FindCompetitionsRes, GetCompetitionRes } from './dtos';
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
   * Query: FindCompetitionsReqQuery
   * - page: 현제 페이지 번호입니다. 최초 요청 시에는 0을 사용합니다. (default: 0).
   * - limit: 한페이지에 표시할 데이터 갯수. (default: 10).
   * - dateFilter: 대회 날짜를 기준으로 필터링합니다. ex) '2023-04'. (default: Now).
   * - locationFilter: 대회가 열리는 위치로 필터링합니다. ex) 서울, 부산, 인천, 대구, 대전, 광주, 울산, 세종, 경기, 충북, 충남, 전남, 경북, 경남, 강원, 전북, 제주.
   * - selectFilter: 태그를 기준으로 필터링합니다. ex) ['간편결제', '얼리버드', '신청가능', '단독출전조정'].
   * - sortOption: 대회를 정렬하는 옵션입니다. ex) '일자순', '조회순', '마감임박순'. (default: '일자순').
   *
   * @tag h-5 competitions
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
      await this.competitionsAppService.findHostingCompetitions({
        hostId: userId,
        page: query.page ?? 0,
        limit: query.limit ?? 10,
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
