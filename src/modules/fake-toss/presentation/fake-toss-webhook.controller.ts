import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { RoleLevels, RoleLevel } from '../../../infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import { ITossPaymentWebhook } from 'toss-payments-server-api/lib/structures/ITossPaymentWebhook';

@Controller('test/fake-toss-webhook')
export class FakeTossWebhookController {
  /**
   * t-1-1 fake-toss-webhook.
   * - RoleLevel: PUBLIC.
   * - fake-toss server에서 발생하는 webhook이벤트를 리스닝합니다.
   * - 프론트엔드에서 해당 api를 호출할일은 없습니다.
   *
   * @tag t-1 fake-toss-webhook
   * @internal
   * @security bearer
   * @param body ITossPaymentWebhook
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('')
  async fakeTossWebhook(@TypedBody() body: ITossPaymentWebhook): Promise<ResponseForm<ITossPaymentWebhook>> {
    return createResponseForm(body);
  }
}
