import { CombinationDiscountSnapshotModel } from '../../../competitions/domain/model/combination-discount-snapshot.model';
import { EarlybirdDiscountSnapshotModel } from '../../../competitions/domain/model/earlybird-discount-snapshot.model';
import { IApplicationPaymentModelData } from '../interface/application-payment.interface';
import { ApplicationPaymentSnapshotModel } from './application-payment-snapshot.model';

export class ApplicationPaymentModel {
  id: IApplicationPaymentModelData['id'];
  createdAt: IApplicationPaymentModelData['createdAt'];
  orderName: IApplicationPaymentModelData['orderName'];
  customerName: IApplicationPaymentModelData['customerName'];
  customerEmail: IApplicationPaymentModelData['customerEmail'];
  status: IApplicationPaymentModelData['status'];
  applicationId: IApplicationPaymentModelData['applicationId'];
  earlybirdDiscountSnapshotId: IApplicationPaymentModelData['earlybirdDiscountSnapshotId'];
  combinationDiscountSnapshotId: IApplicationPaymentModelData['combinationDiscountSnapshotId'];
  applicationPaymentSanpshot: ApplicationPaymentSnapshotModel;
  earlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel;
  combinationDiscountSnapshot: CombinationDiscountSnapshotModel;

  constructor(data: IApplicationPaymentModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.orderName = data.orderName;
    this.customerName = data.customerName;
    this.customerEmail = data.customerEmail;
    this.status = data.status;
    this.applicationId = data.applicationId;
    this.earlybirdDiscountSnapshotId = data.earlybirdDiscountSnapshotId;
    this.combinationDiscountSnapshotId = data.combinationDiscountSnapshotId;
    this.applicationPaymentSanpshot = new ApplicationPaymentSnapshotModel(data.applicationPaymentSanpshot);
    this.earlybirdDiscountSnapshot = new EarlybirdDiscountSnapshotModel(data.earlybirdDiscountSnapshot);
    this.combinationDiscountSnapshot = new CombinationDiscountSnapshotModel(data.combinationDiscountSnapshot);
  }

  toData(): IApplicationPaymentModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      orderName: this.orderName,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      status: this.status,
      applicationId: this.applicationId,
      earlybirdDiscountSnapshotId: this.earlybirdDiscountSnapshotId,
      combinationDiscountSnapshotId: this.combinationDiscountSnapshotId,
      applicationPaymentSanpshot: this.applicationPaymentSanpshot.toData(),
      earlybirdDiscountSnapshot: this.earlybirdDiscountSnapshot.toData(),
      combinationDiscountSnapshot: this.combinationDiscountSnapshot.toData(),
    };
  }
}
