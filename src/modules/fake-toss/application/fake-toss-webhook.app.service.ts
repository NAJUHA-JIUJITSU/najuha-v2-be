import { Injectable } from '@nestjs/common';
import { ProcssTossPaymentSuccessParam } from './fake-ttoss-webhook.app.dto';
import { user } from '../../../api/functional';

@Injectable()
export class FakeTossWebhookAppService {
  constructor() {}

  async processTossPaymentSuccess({ paymentType, orderId, paymentKey, amount }: ProcssTossPaymentSuccessParam) {
    console.log('FakeTossWebhookAppService.processTossPaymentSuccess');
    console.log({ paymentType, orderId, paymentKey, amount });

    // user.applications.order.approve.approveApplicationOrder();

    return;
  }
}
