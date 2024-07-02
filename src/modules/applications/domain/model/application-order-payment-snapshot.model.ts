import { IApplicationOrderPaymentSnapshotModelData } from '../interface/application-order-payment-sanpshot.interface';
import { ParticipationDivisionInfoPaymentModel } from './participation-division-info-pament.model';

export class ApplicationOrderPaymentSnapshotModel {
  id: IApplicationOrderPaymentSnapshotModelData['id'];
  createdAt: IApplicationOrderPaymentSnapshotModelData['createdAt'];
  normalAmount: IApplicationOrderPaymentSnapshotModelData['normalAmount'];
  earlybirdDiscountAmount: IApplicationOrderPaymentSnapshotModelData['earlybirdDiscountAmount'];
  combinationDiscountAmount: IApplicationOrderPaymentSnapshotModelData['combinationDiscountAmount'];
  totalAmount: IApplicationOrderPaymentSnapshotModelData['totalAmount'];
  applicationOrderId: IApplicationOrderPaymentSnapshotModelData['applicationOrderId'];
  participationDivisionInfoPayments: ParticipationDivisionInfoPaymentModel[];

  constructor(data: IApplicationOrderPaymentSnapshotModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.normalAmount = data.normalAmount;
    this.earlybirdDiscountAmount = data.earlybirdDiscountAmount;
    this.combinationDiscountAmount = data.combinationDiscountAmount;
    this.totalAmount = data.totalAmount;
    this.applicationOrderId = data.applicationOrderId;
    this.participationDivisionInfoPayments = data.participationDivisionInfoPayments.map(
      (participationDivisionInfoPayment) => new ParticipationDivisionInfoPaymentModel(participationDivisionInfoPayment),
    );
  }

  toData(): IApplicationOrderPaymentSnapshotModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      normalAmount: this.normalAmount,
      earlybirdDiscountAmount: this.earlybirdDiscountAmount,
      combinationDiscountAmount: this.combinationDiscountAmount,
      totalAmount: this.totalAmount,
      applicationOrderId: this.applicationOrderId,
      participationDivisionInfoPayments: this.participationDivisionInfoPayments.map(
        (participationDivisionInfoPayment) => participationDivisionInfoPayment.toData(),
      ),
    };
  }
}
