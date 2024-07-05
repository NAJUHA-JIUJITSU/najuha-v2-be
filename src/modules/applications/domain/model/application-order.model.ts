import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { CombinationDiscountSnapshotModel } from '../../../competitions/domain/model/combination-discount-snapshot.model';
import { EarlybirdDiscountSnapshotModel } from '../../../competitions/domain/model/earlybird-discount-snapshot.model';
import { IApplicationOrderModelData } from '../interface/application-order.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ApplicationOrderPaymentSnapshotModel } from './application-order-payment-snapshot.model';

export class ApplicationOrderModel {
  id: IApplicationOrderModelData['id'];
  createdAt: IApplicationOrderModelData['createdAt'];
  orderId: IApplicationOrderModelData['orderId'];
  orderName: IApplicationOrderModelData['orderName'];
  paymentKey: IApplicationOrderModelData['paymentKey'];
  customerName: IApplicationOrderModelData['customerName'];
  customerEmail: IApplicationOrderModelData['customerEmail'];
  status: IApplicationOrderModelData['status'];
  isPayed: IApplicationOrderModelData['isPayed'];
  applicationId: IApplicationOrderModelData['applicationId'];
  earlybirdDiscountSnapshotId: IApplicationOrderModelData['earlybirdDiscountSnapshotId'];
  combinationDiscountSnapshotId: IApplicationOrderModelData['combinationDiscountSnapshotId'];
  applicationOrderPaymentSanpshots: ApplicationOrderPaymentSnapshotModel[];
  earlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel | null;
  combinationDiscountSnapshot: CombinationDiscountSnapshotModel | null;

  constructor(data: IApplicationOrderModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.orderId = data.orderId;
    this.paymentKey = data.paymentKey;
    this.orderName = data.orderName;
    this.customerName = data.customerName;
    this.customerEmail = data.customerEmail;
    this.status = data.status;
    this.isPayed = data.isPayed;
    this.applicationId = data.applicationId;
    this.earlybirdDiscountSnapshotId = data.earlybirdDiscountSnapshotId;
    this.combinationDiscountSnapshotId = data.combinationDiscountSnapshotId;
    this.applicationOrderPaymentSanpshots = data.applicationOrderPaymentSnapshots.map(
      (applicationOrderPaymentSnapshot) => new ApplicationOrderPaymentSnapshotModel(applicationOrderPaymentSnapshot),
    );
    this.earlybirdDiscountSnapshot = data.earlybirdDiscountSnapshot
      ? new EarlybirdDiscountSnapshotModel(data.earlybirdDiscountSnapshot)
      : null;
    this.combinationDiscountSnapshot = data.combinationDiscountSnapshot
      ? new CombinationDiscountSnapshotModel(data.combinationDiscountSnapshot)
      : null;
  }

  toData(): IApplicationOrderModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      orderId: this.orderId,
      paymentKey: this.paymentKey,
      orderName: this.orderName,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      status: this.status,
      isPayed: this.isPayed,
      applicationId: this.applicationId,
      earlybirdDiscountSnapshotId: this.earlybirdDiscountSnapshotId,
      combinationDiscountSnapshotId: this.combinationDiscountSnapshotId,
      applicationOrderPaymentSnapshots: this.applicationOrderPaymentSanpshots.map((applicationOrderPaymentSnapshot) =>
        applicationOrderPaymentSnapshot.toData(),
      ),
      earlybirdDiscountSnapshot: this.earlybirdDiscountSnapshot ? this.earlybirdDiscountSnapshot.toData() : null,
      combinationDiscountSnapshot: this.combinationDiscountSnapshot ? this.combinationDiscountSnapshot.toData() : null,
    };
  }

  getOrderId() {
    return this.orderId;
  }

  getStatus() {
    return this.status;
  }

  getIsPayed() {
    return this.isPayed;
  }

  getPaymentKey() {
    if (!this.paymentKey) {
      throw new Error('PaymentKey is null');
    }
    return this.paymentKey;
  }

  getEarlybirdDiscountSnapshot() {
    return this.earlybirdDiscountSnapshot;
  }

  getCombinationDiscountSnapshot() {
    return this.combinationDiscountSnapshot;
  }

  getLatestApplicationOrderPaymentSnapshot() {
    if (this.applicationOrderPaymentSanpshots.length === 0) {
      throw new Error('ApplicationOrderPaymentSnapshot is empty');
    }
    return this.applicationOrderPaymentSanpshots[this.applicationOrderPaymentSanpshots.length - 1];
  }

  getSencodLatestApplicationOrderPaymentSnapshot() {
    if (this.applicationOrderPaymentSanpshots.length < 2) {
      throw new Error('ApplicationOrderPaymentSnapshot is empty');
    }
    return this.applicationOrderPaymentSanpshots[this.applicationOrderPaymentSanpshots.length - 2];
  }

  approve(amount: number, paymentKey: IApplicationOrderModelData['paymentKey']) {
    if (this.status !== 'READY') throw new Error('Only READY status can be approved');
    if (this.getLatestApplicationOrderPaymentSnapshot().getTotalAmount() !== amount) {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH);
    }

    const latestApplicationOrderPaymentSnapshot = this.getLatestApplicationOrderPaymentSnapshot();
    latestApplicationOrderPaymentSnapshot.approve();

    this.status = 'DONE';
    this.isPayed = true;
    this.paymentKey = paymentKey;
  }

  addApplicationOrderPaymentSnapshot(applicationOrderPaymentSnapshot: ApplicationOrderPaymentSnapshotModel) {
    this.applicationOrderPaymentSanpshots.push(applicationOrderPaymentSnapshot);
  }

  cancelParticipationDivisionInfoPayments(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    const latestApplicationOrderPaymentSnapshot = this.getLatestApplicationOrderPaymentSnapshot();
    latestApplicationOrderPaymentSnapshot.cancelParticipationDivisionInfoPayments(participationDivisionInfoIds);
    if (
      participationDivisionInfoIds.length ===
      latestApplicationOrderPaymentSnapshot.getParticipationDivisionInfoPayments().length
    ) {
      this.status = 'CANCELED';
    } else {
      this.status = 'PARTIAL_CANCELED';
    }
  }

  getCancelAmount() {
    if (this.status === 'CANCELED') {
      return this.getLatestApplicationOrderPaymentSnapshot().getTotalAmount();
    } else if (this.status === 'PARTIAL_CANCELED') {
      const latestApplicationOrderPaymentSnapshot = this.getLatestApplicationOrderPaymentSnapshot();
      const secondLatestApplicationOrderPaymentSnapshot = this.getSencodLatestApplicationOrderPaymentSnapshot();

      return Math.abs(
        latestApplicationOrderPaymentSnapshot.getTotalAmount() -
          secondLatestApplicationOrderPaymentSnapshot.getTotalAmount(),
      );
    }
    // todo!!!: 에러 표준화
    throw new Error('Only CANCELED or PARTIAL_CANCELED status can be refunded');
  }
}
