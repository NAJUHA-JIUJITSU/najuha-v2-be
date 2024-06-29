import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { IApplication } from './application.interface';
import {
  IEarlybirdDiscountSnapshot,
  IEarlybirdDiscountSnapshotModelData,
} from '../../../competitions/domain/interface/earlybird-discount-snapshot.interface';
import {
  IApplicationPaymentSnapshot,
  IApplicationPaymentSnapshotModelData,
} from './application-payment-sanpshot.interface';
import { tags } from 'typia';
import {
  ICombinationDiscountSnapshot,
  ICombinationDiscountSnapshotModelData,
} from '../../../competitions/domain/interface/combination-discount-snapshot.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
export interface IApplicationPayment {
  /** UUID v7. */
  id: TId;

  /** CreatedAt */
  createdAt: TDateOrStringDate;

  orderName: string & tags.MinLength<1> & tags.MaxLength<256>;

  customerName: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$'>;

  customerEmail: string & tags.MinLength<1> & tags.MaxLength<320> & tags.Format<'email'>;

  status: TApplicationPaymentStatus;

  /** - application id. */
  applicationId: IApplication['id'];

  earlybirdDiscountSnapshotId: IEarlybirdDiscountSnapshot['id'];

  combinationDiscountSnapshotId: ICombinationDiscountSnapshot['id'];

  applicationPaymentSanpshot: IApplicationPaymentSnapshot;

  earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot;

  combinationDiscountSnapshot: ICombinationDiscountSnapshot;
}

export interface IApplicationPaymentModelData {
  id: IApplicationPayment['id'];
  createdAt: IApplicationPayment['createdAt'];
  orderName: IApplicationPayment['orderName'];
  customerName: IApplicationPayment['customerName'];
  customerEmail: IApplicationPayment['customerEmail'];
  status: IApplicationPayment['status'];
  applicationId: IApplicationPayment['applicationId'];
  earlybirdDiscountSnapshotId: IApplicationPayment['earlybirdDiscountSnapshotId'];
  combinationDiscountSnapshotId: IApplicationPayment['combinationDiscountSnapshotId'];
  applicationPaymentSanpshot: IApplicationPaymentSnapshotModelData;
  earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshotModelData;
  combinationDiscountSnapshot: ICombinationDiscountSnapshotModelData;
}

// --------------------------------------------------------------
// ENUM
// --------------------------------------------------------------
type TApplicationPaymentStatus = 'READY' | 'DONE' | 'FAIL' | 'CANCELED';
