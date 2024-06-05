import { Controller } from '@nestjs/common';
import { ViewCountAppService } from '../applicaiton/view-count.app.service';
import { TypedParam, TypedRoute } from '@nestia/core';
import { RoleLevel, RoleLevels } from 'src/infrastructure/guard/role.guard';
import { TId } from 'src/common/common-types';

@Controller('public-api/view-count')
export class PublicViewCountController {
  constructor(private readonly viewCountAppService: ViewCountAppService) {}

  /**
   * p-8-1 incrementPostViewCount.
   *
   * @tag p-8 view-count
   * @param postId 게시글 id
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('/post/:postId')
  async incrementPostViewCount(@TypedParam('postId') postId: TId) {
    await this.viewCountAppService.incrementPostViewCount(postId);
  }
}
