import { CombinationDiscountSnapshotModel } from '../../../competitions/domain/model/combination-discount-snapshot.model';
import { EarlybirdDiscountSnapshotModel } from '../../../competitions/domain/model/earlybird-discount-snapshot.model';
import { IApplicationOrderModelData } from '../interface/application-order.interface';
import { ApplicationOrderPaymentSnapshotModel } from './application-order-payment-snapshot.model';

export class ApplicationOrderModel {
  id: IApplicationOrderModelData['id'];
  createdAt: IApplicationOrderModelData['createdAt'];
  orderId: IApplicationOrderModelData['orderId'];
  orderName: IApplicationOrderModelData['orderName'];
  customerName: IApplicationOrderModelData['customerName'];
  customerEmail: IApplicationOrderModelData['customerEmail'];
  status: IApplicationOrderModelData['status'];
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
    this.orderName = data.orderName;
    this.customerName = data.customerName;
    this.customerEmail = data.customerEmail;
    this.status = data.status;
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
      orderName: this.orderName,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      status: this.status,
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
}
