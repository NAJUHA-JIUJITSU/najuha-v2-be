// src/toss-payments/toss-payments.service.ts
import { Injectable } from '@nestjs/common';
import * as toss from 'toss-payments-server-api';
import { ITossPayment } from 'toss-payments-server-api/lib/structures/ITossPayment';
import typia from 'typia';
import {
  ApprovePaymentParam,
  ApprovePaymentRet,
  CancelPaymentParam,
  CancelPaymentRet,
  GetPaymentParam,
  GetPaymentRet,
  KeyInParam,
  KeyInRet,
} from './payments.app.dto';
import { Cancel } from 'axios';

@Injectable()
export class PaymentsAppService {
  private connection: toss.IConnection;

  constructor() {
    this.connection = {
      host: 'http://127.0.0.1:30771', // FAKE-SERVER
      // host: 'https://api.tosspayments.com', // REAL-SERVER
      headers: {
        Authorization: `Basic ${Buffer.from('test_ak_ZORzdMaqN3wQd5k6ygr5AkYXQGwy:').toString('base64')}`,
      },
    };
  }

  // 결제 승인
  async approvePayment({ paymentKey, orderId, amount }: ApprovePaymentParam): Promise<ApprovePaymentRet> {
    const payment: ITossPayment = await toss.functional.v1.payments.approve(this.connection, paymentKey, {
      orderId,
      amount,
    });
    return typia.assert<ApprovePaymentRet>({
      payment,
    });
  }

  // 결제 정보 조회
  async getPayment({ paymentKey }: GetPaymentParam): Promise<GetPaymentRet> {
    const payment: ITossPayment = await toss.functional.v1.payments.at(this.connection, paymentKey);
    return typia.assert<GetPaymentRet>({
      payment,
    });
  }

  async cancelPayment({ paymentKey, cancelReason, cancelAmount }: CancelPaymentParam): Promise<CancelPaymentRet> {
    const payment = await toss.functional.v1.payments.cancel(this.connection, paymentKey, {
      paymentKey,
      cancelReason,
      cancelAmount,
    });
    return typia.assert<CancelPaymentRet>({
      payment,
    });
  }

  /**
   * payments.key_in 은 카드를 이용한 결제를 할 때 호출되는 API 함수이다.
   *
   * NAJUHA에서는 프론트엔드에서 tosspayments-sdk 위젯을 사용하여 결제를 요청하고, 결제 요청 성공 여부를 수신하는 webhook에서 결제 승인요청을 NAJUHA 서버로 전달하기 때문에, 해당 함수는 사용되지 않는다.
   * 하지만 테스트 자동화를 위하여 이 함수가 필요하다.
   * `__approved: false` 로 설정하여 프론엔드에서 tosspayments-sdk 위젯을 사용하여 결제 요청성공 및 결제 승인 이전 상테를 시뮬레이션할 수 있다.
   *
   * @param param KeyInParam
   * @returns ITossPayment
   * @throws Error
   */
  async keyIn(param: KeyInParam): Promise<KeyInRet> {
    const payment = await toss.functional.v1.payments.key_in(this.connection, {
      ...param,
      __approved: false,
    });
    return typia.assert<KeyInRet>({
      payment,
    });
  }
}
