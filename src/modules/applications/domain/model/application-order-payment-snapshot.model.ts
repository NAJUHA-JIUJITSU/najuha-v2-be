import { IParticipationDivisionInfo } from '../../../../../packages/api/lib/modules/applications/domain/interface/participation-division-info.interface';
import { IApplicationOrderPaymentSnapshotModelData } from '../interface/application-order-payment-sanpshot.interface';
import { ParticipationDivisionInfoPaymentModel } from './participation-division-info-pament.model';

export class ApplicationOrderPaymentSnapshotModel {
  private id: IApplicationOrderPaymentSnapshotModelData['id'];
  private createdAt: IApplicationOrderPaymentSnapshotModelData['createdAt'];
  private normalAmount: IApplicationOrderPaymentSnapshotModelData['normalAmount'];
  private earlybirdDiscountAmount: IApplicationOrderPaymentSnapshotModelData['earlybirdDiscountAmount'];
  private combinationDiscountAmount: IApplicationOrderPaymentSnapshotModelData['combinationDiscountAmount'];
  private totalAmount: IApplicationOrderPaymentSnapshotModelData['totalAmount'];
  private applicationOrderId: IApplicationOrderPaymentSnapshotModelData['applicationOrderId'];
  private participationDivisionInfoPayments: ParticipationDivisionInfoPaymentModel[];

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

  approve() {
    this.participationDivisionInfoPayments.forEach((participationDivisionInfoPayment) =>
      participationDivisionInfoPayment.approve(),
    );
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  getParticipationDivisionInfoPayments() {
    return this.participationDivisionInfoPayments;
  }

  cancelParticipationDivisionInfoPayments(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    this.participationDivisionInfoPayments
      .filter((participationDivisionInfoPayment) =>
        participationDivisionInfoIds.includes(participationDivisionInfoPayment.getParticipationDivisionInfoId()),
      )
      .forEach((participationDivisionInfoPayment) => participationDivisionInfoPayment.cancel());
  }
}
