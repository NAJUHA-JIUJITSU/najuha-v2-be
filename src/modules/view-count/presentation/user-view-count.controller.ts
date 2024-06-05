import { Controller, Req } from '@nestjs/common';
import { ViewCountAppService } from '../applicaiton/view-count.app.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { RoleLevel, RoleLevels } from 'src/infrastructure/guard/role.guard';
import { TId } from 'src/common/common-types';
import { ResponseForm, createResponseForm } from 'src/common/response/response';

@Controller('user-api/view-count')
export class UserViewCountController {
  constructor(private readonly viewCountAppService: ViewCountAppService) {}

  /**
   * u-8-1 incrementPostViewCount.
   * - RoleLevel: USER
   * - 게시글 조회수를 증가시킵니다.
   * - accessToken에서 userId를 추출하여 사용자를 식별합니다.
   * - 동일한 userId로 하루에 한 번만 조회수를 증가시킬 수 있습니다.
   *
   * @tag u-8 view-count
   * @security bearer
   * @param postId 게시글 id
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/post/:postId')
  async incrementPostViewCount(@Req() req: Request, @TypedParam('postId') postId: TId): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.viewCountAppService.incrementEntityViewCount({
        userCredential: req['userId'],
        entityType: 'POST',
        entityId: postId,
      }),
    );
  }

  /**
   * u-8-2 incrementCompetitionViewCount.
   * - RoleLevel: USER
   * - 대회 조회수를 증가시킵니다.
   * - accessToken에서 userId를 추출하여 사용자를 식별합니다.
   * - 동일한 userId로 하루에 한 번만 조회수를 증가시킬 수 있습니다.
   *
   * @tag u-8 view-count
   * @security bearer
   * @param competitionId 대회 id
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/competition/:competitionId')
  async incrementCompetitionViewCount(
    @Req() req: Request,
    @TypedParam('competitionId') competitionId: TId,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.viewCountAppService.incrementEntityViewCount({
        userCredential: req['userId'],
        entityType: 'COMPETITION',
        entityId: competitionId,
      }),
    );
  }
}
