// src/toss-payments/toss-payments.service.ts
import { Injectable } from '@nestjs/common';
import * as toss from 'toss-payments-server-api';
import { ITossPayment } from 'toss-payments-server-api/lib/structures/ITossPayment';
import typia from 'typia';

@Injectable()
export class PaymentsAppService {
  private connection: toss.IConnection;

  constructor() {
    this.connection = {
      // host: 'http://127.0.0.1:30771', // FAKE-SERVER
      host: 'https://api.tosspayments.com', // REAL-SERVER
      headers: {
        Authorization: `Basic ${Buffer.from('test_ak_ZORzdMaqN3wQd5k6ygr5AkYXQGwy:').toString('base64')}`,
      },
    };
  }

  // 결제 승인
  async approvePayment(paymentKey: string, orderId: string, amount: number): Promise<ITossPayment> {
    const approved: ITossPayment = await toss.functional.v1.payments.approve(this.connection, paymentKey, {
      orderId,
      amount,
    });

    return typia.assert<ITossPayment>(approved);
  }

  // 결제 정보 조회
  async getPaymentInfo(paymentKey: string): Promise<ITossPayment> {
    const payment: ITossPayment = await toss.functional.v1.payments.at(this.connection, paymentKey);

    return typia.assert<ITossPayment>(payment);
  }
}
