import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { IApplication } from './application.interface';
import {
  IEarlybirdDiscountSnapshot,
  IEarlybirdDiscountSnapshotModelData,
} from '../../../competitions/domain/interface/earlybird-discount-snapshot.interface';
import {
  IApplicationOrderPaymentSnapshot,
  IApplicationOrderPaymentSnapshotModelData,
} from './application-order-payment-sanpshot.interface';
import { tags } from 'typia';
import {
  ICombinationDiscountSnapshot,
  ICombinationDiscountSnapshotModelData,
} from '../../../competitions/domain/interface/combination-discount-snapshot.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
/**
 * ApplicationOrder.
 *
 * 참가신청 주문 정보.
 * - 참가신청에 대한 주문 정보를 저장합니다.
 * - 참가신청에 대해 결제 실패 등의 이유로 여려개의 주문이 발생할 수 있습니다.
 */
export interface IApplicationOrder {
  /** UUID v7. */
  id: TId;

  createdAt: TDateOrStringDate;

  /**
   * - 주문번호(총 63자)
   * - `${applicationOrder.id}_${competition.competitionPaymentId}` 형태로 생성.
   * - 36자의 applicationOrder.id(uuidv7)와 26자의 competition.competitionPaymentId(ULID)를 조합하여 생성.
   * - ex) 123e4567-e89b-12d3-a456-426614174000_01ARYZ6S41MK3W7DMT3RZR9K9Z
   *
   * Q. 왜 applicationOrder.id와 competition.competitionPaymentId를 조합하여 생성하나요?
   * A. 정산과정에서 동일한 대회의 주문 번호를 식별하기 위함입니다.
   */
  orderId: string & tags.MinLength<63> & tags.MaxLength<63>;

  /**
   * tosspayments에서 발급받은 결제키.
   * - 결제가 완료되면 발급받은 결제키를 저장합니다.
   * - 결제가 완료되지 않은 경우 null.
   * - 고유한 결제정보를 식별하기 위한 키입니다.
   */
  paymentKey: (string & tags.MinLength<1> & tags.MaxLength<200>) | null;

  /**
   * 주문명(총 100자)
   * - 신청한 대회의 title이 저장됩니다.
   */
  orderName: string & tags.MinLength<1> & tags.MaxLength<100>;

  /**
   * 주문자 이름(총 64자)
   */
  customerName: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$'>;

  /**
   * 주문자 이메일(총 100자)
   */
  customerEmail: string & tags.MinLength<1> & tags.MaxLength<100> & tags.Format<'email'>;

  /**
   * 주문 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - FAIL: 결제 실패
   * - PARTIAL_CANCELED: 부분 취소
   * - CANCELED: 전체 취소
   */
  status: TApplicationOrderStatus;

  /**
   * 결제 여부.
   */
  isPayed: boolean;

  applicationId: IApplication['id'];

  earlybirdDiscountSnapshotId: IEarlybirdDiscountSnapshot['id'] | null;

  combinationDiscountSnapshotId: ICombinationDiscountSnapshot['id'] | null;

  applicationOrderPaymentSnapshots: IApplicationOrderPaymentSnapshot[];

  earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot | null;

  combinationDiscountSnapshot: ICombinationDiscountSnapshot | null;
}

export interface IApplicationOrderModelData {
  id: IApplicationOrder['id'];
  createdAt: IApplicationOrder['createdAt'];
  orderId: IApplicationOrder['orderId'];
  paymentKey: IApplicationOrder['paymentKey'];
  orderName: IApplicationOrder['orderName'];
  customerName: IApplicationOrder['customerName'];
  customerEmail: IApplicationOrder['customerEmail'];
  status: IApplicationOrder['status'];
  isPayed: IApplicationOrder['isPayed'];
  applicationId: IApplicationOrder['applicationId'];
  earlybirdDiscountSnapshotId: IApplicationOrder['earlybirdDiscountSnapshotId'];
  combinationDiscountSnapshotId: IApplicationOrder['combinationDiscountSnapshotId'];
  earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshotModelData | null;
  combinationDiscountSnapshot: ICombinationDiscountSnapshotModelData | null;
  applicationOrderPaymentSnapshots: IApplicationOrderPaymentSnapshotModelData[];
}

// --------------------------------------------------------------
// ENUM
// --------------------------------------------------------------
type TApplicationOrderStatus = 'READY' | 'DONE' | 'FAIL' | 'PARTIAL_CANCELED' | 'CANCELED';
