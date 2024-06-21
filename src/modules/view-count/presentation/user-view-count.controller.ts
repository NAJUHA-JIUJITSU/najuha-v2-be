import { Controller, Ip, Req } from '@nestjs/common';
import { ViewCountAppService } from '../applicaiton/view-count.app.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { RoleLevel, RoleLevels } from '../../../infrastructure/guard/role.guard';
import { TId } from '../../../common/common-types';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import { IncrementEntityViewCountRes } from './view-count.controller.dto';

@Controller('user/view-count')
export class UserViewCountController {
  constructor(private readonly viewCountAppService: ViewCountAppService) {}

  /**
   * u-8-1 incrementPostViewCount.
   * - RoleLevel: PUBLIC_OR_USER.
   * - 게시글 조회수를 증가시킵니다.
   * - 로그인 한 유저의 경우 accessToken에서 userId를 추출하여 사용자를 식별합니다.
   * - 로그인하지 않은 유저의 경우 ip를 사용하여 사용자를 식별합니다.
   * - 동일한 userId로 하루에 한 번만 조회수를 증가시킬 수 있습니다.
   *
   * @tag u-8 view-count
   * @security bearer
   * @param postId 게시글 id
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC_OR_USER)
  @TypedRoute.Post('/post/:postId')
  async incrementPostViewCount(
    @Req() req: Request,
    @Ip() ip: string,
    @TypedParam('postId') postId: TId,
  ): Promise<ResponseForm<IncrementEntityViewCountRes>> {
    return createResponseForm(
      await this.viewCountAppService.incrementEntityViewCount({
        userCredential: req['userId'] || ip,
        entityType: 'POST',
        entityId: postId,
      }),
    );
  }

  /**
   * u-8-2 incrementCompetitionViewCount.
   * - RoleLevel: PUBLIC_OR_USER.
   * - 대회 조회수를 증가시킵니다.
   * - 로그인 한 유저의 경우 accessToken에서 userId를 추출하여 사용자를 식별합니다.
   * - 로그인하지 않은 유저의 경우 ip를 사용하여 사용자를 식별합니다.
   * - 동일한 userId로 하루에 한 번만 조회수를 증가시킬 수 있습니다.
   *
   * @tag u-8 view-count
   * @security bearer
   * @param competitionId 대회 id
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC_OR_USER)
  @TypedRoute.Post('/competition/:competitionId')
  async incrementCompetitionViewCount(
    @Req() req: Request,
    @Ip() ip: string,
    @TypedParam('competitionId') competitionId: TId,
  ): Promise<ResponseForm<IncrementEntityViewCountRes>> {
    return createResponseForm(
      await this.viewCountAppService.incrementEntityViewCount({
        userCredential: req['userId'] || ip,
        entityType: 'COMPETITION',
        entityId: competitionId,
      }),
    );
  }
}
