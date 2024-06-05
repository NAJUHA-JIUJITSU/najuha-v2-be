import { Controller, Ip } from '@nestjs/common';
import { ViewCountAppService } from '../applicaiton/view-count.app.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { RoleLevel, RoleLevels } from 'src/infrastructure/guard/role.guard';
import { TId } from 'src/common/common-types';
import { ResponseForm, createResponseForm } from 'src/common/response/response';

@Controller('public-api/view-count')
export class PublicViewCountController {
  constructor(private readonly viewCountAppService: ViewCountAppService) {}

  /**
   * p-8-1 incrementPostViewCount.
   * - RoleLevel: PUBLIC
   * - 게시글 조회수를 증가시킵니다.
   * - ip를 사용하여 사용자를 식별합니다.
   * - 동일한 ip로 하루에 한 번만 조회수를 증가시킬 수 있습니다.
   *
   * @tag p-8 view-count
   * @param postId 게시글 id
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('/post/:postId')
  async incrementPostViewCount(@Ip() ip: string, @TypedParam('postId') postId: TId): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.viewCountAppService.incrementEntityViewCount({
        userCredential: ip,
        entityType: 'POST',
        entityId: postId,
      }),
    );
  }

  /**
   * p-8-2 incrementCompetitionViewCount.
   * - RoleLevel: PUBLIC
   * - 대회 조회수를 증가시킵니다.
   * - ip를 사용하여 사용자를 식별합니다.
   * - 동일한 ip로 하루에 한 번만 조회수를 증가시킬 수 있습니다.
   *
   * @tag p-8 view-count
   * @param competitionId 대회 id
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('/competition/:competitionId')
  async incrementCompetitionViewCount(
    @Ip() ip: string,
    @TypedParam('competitionId') competitionId: TId,
  ): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.viewCountAppService.incrementEntityViewCount({
        userCredential: ip,
        entityType: 'COMPETITION',
        entityId: competitionId,
      }),
    );
  }
}
