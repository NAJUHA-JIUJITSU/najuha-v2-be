import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from '../../../infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import { FakeTossWebhookAppService } from '../application/fake-toss-webhook.app.service';
import { ProcessTossPaymentSuccessReqQuery } from './fake-toss-webhook.controoler.dto';

@Controller('test/fake-toss-webhook')
export class FakeTossWebhookController {
  constructor(private readonly FakeTossWebhookAppService: FakeTossWebhookAppService) {}

  /**
   * t-1-1 processTossPaymentSuccess.
   * - RoleLevel: PUBLIC.
   * - 프론트엔드 구현 없이 결제요청을 테스트하기위한 webhook 입니다. 프론트엔드에서 해당 api를 호출할일은 없습니다.
   * - tosspayment sdk 위젯에서 결제 요청 성공 여부를 수신하는 webhook.
   *
   * @tag t-1 fake-toss-webhook
   * @security bearer
   * @param query ProcessTossPaymentSuccessReqQuery
   * @returns void
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('/success')
  async processTossPaymentSuccess(@TypedQuery() query: ProcessTossPaymentSuccessReqQuery): Promise<ResponseForm<void>> {
    return createResponseForm(await this.FakeTossWebhookAppService.processTossPaymentSuccess({ ...query }));
  }
}
