import { ITossPayment } from 'toss-payments-server-api/lib/structures/ITossPayment';
import { tags } from 'typia';

// ---------------------------------------------------------------------------
// AppService Param
// ---------------------------------------------------------------------------
export interface ApprovePaymentParam {
  paymentKey: string;

  orderId: string;

  amount: number;
}

export interface GetPaymentParam {
  paymentKey: string;
}

export interface KeyInParam {
  /**
   * 결제 수단이 신용 카드임을 의미.
   */
  method: 'card';
  /**
   * 카드 번호.
   */
  cardNumber: string & tags.Pattern<'[0-9]{16}'>;
  /**
   * 카드 만료 년도 (2 자리).
   */
  cardExpirationYear: string & tags.Pattern<'\\d{2}'>;
  /**
   * 카드 만료 월 (2 자리).
   */
  cardExpirationMonth: string & tags.Pattern<'^(0[1-9]|1[012])$'>;
  /**
   * 지불 총액.
   */
  amount: number;
  /**
   * 주문 식별자 키.
   *
   * 토스 페이먼츠가 아닌, 이를 이용하는 서비스에서 자체적으로 관리하는 식별자 키.
   */
  orderId: string;
  /**
   * 주문 이름.
   *
   * 토스 페이먼츠가 아닌, 이를 이용하는 서비스에서 발급한 주문명.
   */
  orderName?: string;
  /**
   * 고객의 이메일.
   */
  customerEmail?: string & tags.Format<'email'>;
}

// ---------------------------------------------------------------------------
// AppService Result
// ---------------------------------------------------------------------------
export interface ApprovePaymentRet {
  payment: ITossPayment;
}

export interface GetPaymentRet {
  payment: ITossPayment;
}

export interface KeyInRet {
  payment: ITossPayment;
}
