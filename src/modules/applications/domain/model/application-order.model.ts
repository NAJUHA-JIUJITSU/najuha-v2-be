import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { CombinationDiscountSnapshotModel } from '../../../competitions/domain/model/combination-discount-snapshot.model';
import { EarlybirdDiscountSnapshotModel } from '../../../competitions/domain/model/earlybird-discount-snapshot.model';
import { IApplicationOrderModelData } from '../interface/application-order.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ApplicationOrderPaymentSnapshotModel } from './application-order-payment-snapshot.model';

export class ApplicationOrderModel {
  /** properties */
  private readonly _id: IApplicationOrderModelData['id'];
  private readonly _createdAt: IApplicationOrderModelData['createdAt'];
  private readonly _orderId: IApplicationOrderModelData['orderId'];
  private readonly _orderName: IApplicationOrderModelData['orderName'];
  private readonly _customerName: IApplicationOrderModelData['customerName'];
  private readonly _customerEmail: IApplicationOrderModelData['customerEmail'];
  private readonly _applicationId: IApplicationOrderModelData['applicationId'];
  private _paymentKey: IApplicationOrderModelData['paymentKey'];
  private _status: IApplicationOrderModelData['status'];
  private _isPayed: IApplicationOrderModelData['isPayed'];
  /** relations */
  private readonly _earlybirdDiscountSnapshotId: IApplicationOrderModelData['earlybirdDiscountSnapshotId'];
  private readonly _combinationDiscountSnapshotId: IApplicationOrderModelData['combinationDiscountSnapshotId'];
  private readonly _applicationOrderPaymentSanpshots: ApplicationOrderPaymentSnapshotModel[];
  private readonly _earlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel | null;
  private readonly _combinationDiscountSnapshot: CombinationDiscountSnapshotModel | null;

  constructor(data: IApplicationOrderModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._orderId = data.orderId;
    this._paymentKey = data.paymentKey;
    this._orderName = data.orderName;
    this._customerName = data.customerName;
    this._customerEmail = data.customerEmail;
    this._status = data.status;
    this._isPayed = data.isPayed;
    this._applicationId = data.applicationId;
    this._earlybirdDiscountSnapshotId = data.earlybirdDiscountSnapshotId;
    this._combinationDiscountSnapshotId = data.combinationDiscountSnapshotId;
    this._applicationOrderPaymentSanpshots = data.applicationOrderPaymentSnapshots.map(
      (applicationOrderPaymentSnapshot) => new ApplicationOrderPaymentSnapshotModel(applicationOrderPaymentSnapshot),
    );
    this._earlybirdDiscountSnapshot = data.earlybirdDiscountSnapshot
      ? new EarlybirdDiscountSnapshotModel(data.earlybirdDiscountSnapshot)
      : null;
    this._combinationDiscountSnapshot = data.combinationDiscountSnapshot
      ? new CombinationDiscountSnapshotModel(data.combinationDiscountSnapshot)
      : null;
  }

  toData(): IApplicationOrderModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      orderId: this._orderId,
      paymentKey: this._paymentKey,
      orderName: this._orderName,
      customerName: this._customerName,
      customerEmail: this._customerEmail,
      status: this._status,
      isPayed: this._isPayed,
      applicationId: this._applicationId,
      earlybirdDiscountSnapshotId: this._earlybirdDiscountSnapshotId,
      combinationDiscountSnapshotId: this._combinationDiscountSnapshotId,
      applicationOrderPaymentSnapshots: this._applicationOrderPaymentSanpshots.map((applicationOrderPaymentSnapshot) =>
        applicationOrderPaymentSnapshot.toData(),
      ),
      earlybirdDiscountSnapshot: this._earlybirdDiscountSnapshot ? this._earlybirdDiscountSnapshot.toData() : null,
      combinationDiscountSnapshot: this._combinationDiscountSnapshot
        ? this._combinationDiscountSnapshot.toData()
        : null,
    };
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get orderId() {
    return this._orderId;
  }

  get orderName() {
    return this._orderName;
  }

  get paymentKey() {
    if (!this._paymentKey) throw new Error('PaymentKey is null, please check the payment status');
    return this._paymentKey;
  }

  get customerName() {
    return this._customerName;
  }

  get customerEmail() {
    return this._customerEmail;
  }

  get status() {
    return this._status;
  }

  get isPayed() {
    return this._isPayed;
  }

  get applicationId() {
    return this._applicationId;
  }

  get earlybirdDiscountSnapshotId() {
    return this._earlybirdDiscountSnapshotId;
  }

  get combinationDiscountSnapshotId() {
    return this._combinationDiscountSnapshotId;
  }

  get applicationOrderPaymentSanpshots() {
    return [...this._applicationOrderPaymentSanpshots];
  }

  get earlybirdDiscountSnapshot() {
    return this._earlybirdDiscountSnapshot;
  }

  get combinationDiscountSnapshot() {
    return this._combinationDiscountSnapshot;
  }

  get latestApplicationOrderPaymentSnapshot() {
    if (this._applicationOrderPaymentSanpshots.length === 0) {
      throw new Error('ApplicationOrderPaymentSnapshot is empty');
    }
    return this._applicationOrderPaymentSanpshots[this._applicationOrderPaymentSanpshots.length - 1];
  }

  get secondToLastApplicationOrderPaymentSnapshot() {
    if (this._applicationOrderPaymentSanpshots.length < 2) {
      throw new Error('ApplicationOrderPaymentSnapshot is empty');
    }
    return this._applicationOrderPaymentSanpshots[this._applicationOrderPaymentSanpshots.length - 2];
  }

  approve(amount: number, paymentKey: IApplicationOrderModelData['paymentKey']) {
    if (this._status !== 'READY') throw new Error('Only READY status can be approved');
    if (this.latestApplicationOrderPaymentSnapshot.totalAmount !== amount) {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH);
    }

    const latestApplicationOrderPaymentSnapshot = this.latestApplicationOrderPaymentSnapshot;
    latestApplicationOrderPaymentSnapshot.approve();

    this._status = 'DONE';
    this._isPayed = true;
    this._paymentKey = paymentKey;
  }

  addApplicationOrderPaymentSnapshot(applicationOrderPaymentSnapshot: ApplicationOrderPaymentSnapshotModel) {
    this._applicationOrderPaymentSanpshots.push(applicationOrderPaymentSnapshot);
  }

  cancelParticipationDivisionInfoPayments(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    this.latestApplicationOrderPaymentSnapshot.cancelParticipationDivisionInfoPayments(participationDivisionInfoIds);
    if (
      participationDivisionInfoIds.length ===
      this.latestApplicationOrderPaymentSnapshot.participationDivisionInfoPayments.length
    ) {
      this._status = 'CANCELED';
    } else {
      this._status = 'PARTIAL_CANCELED';
    }
  }

  calculateCancelAmount() {
    if (this._status === 'CANCELED') {
      return this.latestApplicationOrderPaymentSnapshot.totalAmount;
    } else if (this._status === 'PARTIAL_CANCELED') {
      const latestApplicationOrderPaymentSnapshot = this.latestApplicationOrderPaymentSnapshot;
      const secondLatestApplicationOrderPaymentSnapshot = this.secondToLastApplicationOrderPaymentSnapshot;

      return Math.abs(
        latestApplicationOrderPaymentSnapshot.totalAmount - secondLatestApplicationOrderPaymentSnapshot.totalAmount,
      );
    }
    throw new Error('Only CANCELED or PARTIAL_CANCELED status can be refunded');
  }
}
