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
export interface IApplicationOrder {
  /** UUID v7. */
  id: TId;

  /** CreatedAt */
  createdAt: TDateOrStringDate;

  /**
   * - 주문번호(총 63자)
   * - `${applicationOrder.id}_${competition.competitionPaymentId}` 형태로 생성.
   * - 36자의 applicationOrder.id(uuidv7)와 26자의 competition.competitionPaymentId(ULID)를 조합하여 생성.
   * - ex) 123e4567-e89b-12d3-a456-426614174000_01ARYZ6S41MK3W7DMT3RZR9K9Z
   *
   * Q. 왜 applicationOrder.id와 competition.competitionPaymentId를 조합하여 생성하나요?
   * A. 정산과정에서 동일한 대회의 주문 번호를 식별하기 위함입니다.
   *
   * Q. 버전 1 에서는 대회이름으로 동일한 대회의 주분을 식별했는데, 왜 변경했나요?
   * A. 대회이름은 변경될 수 있기 때문에 대회이름으로 주문을 식별하면 안됩니다.
   */
  orderId: string & tags.MinLength<63> & tags.MaxLength<63>;

  paymentKey: (string & tags.MinLength<1> & tags.MaxLength<200>) | null;

  orderName: string & tags.MinLength<1> & tags.MaxLength<100>;

  customerName: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$'>;

  customerEmail: string & tags.MinLength<1> & tags.MaxLength<100> & tags.Format<'email'>;

  status: TApplicationOrderStatus;

  isPayed: boolean;

  /** - application id. */
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
