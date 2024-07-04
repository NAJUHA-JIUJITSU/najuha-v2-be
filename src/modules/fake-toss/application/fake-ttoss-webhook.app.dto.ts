/**
 * tosspayment sdk 위젯에서 결제 요청성공 시 전달되는 webhook 데이터
 * reference: https://docs.tosspayments.com/reference
 */
export interface ProcssTossPaymentSuccessParam {
  /**
   * 결제 유형입니다. NORMAL, BRANDPAY, KEYIN 중 하나입니다.
   * - NORMAL: 일반 결제입니다. 코어 결제 승인 API를 호출해서 결제를 완료하세요.
   * - BRANDPAY: 브랜드페이 결제입니다. 브랜드페이 결제 승인 API를 호출해서 결제를 완료하세요.
   * - KEYIN: 키인 결제입니다. 코어 결제 승인 API를 호출해서 결제를 완료하세요.
   *
   */
  paymentType: string;

  /**
   * 주문번호입니다.
   * - 최소 길이는 6자, 최대 길이는 64자입니다.
   * - 주문한 결제를 식별하는 역할로, 결제를 요청할 때 가맹점에서 만들어서 사용한 값입니다.
   * - 결제 데이터 관리를 위해 반드시 저장해야 합니다. 중복되지 않는 고유한 값을 발급해야 합니다. 결제 상태가 변해도 값이 유지됩니다.
   */
  orderId: string;

  /**
   * 결제의 키 값입니다.
   * - 최대 길이는 200자입니다.
   * - 결제를 식별하는 역할로, 중복되지 않는 고유한 값입니다.
   */
  paymentKey: string;

  /**
   * 결제 금액입니다.
   * - 결제 금액을 백엔드 서버로 요청을 보내 검증할 때 사용합니다.
   */
  amount: number;
}
