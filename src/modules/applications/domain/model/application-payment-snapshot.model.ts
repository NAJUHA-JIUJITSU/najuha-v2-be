import { IApplicationPaymentSnapshotModelData } from '../interface/application-payment-sanpshot.interface';
import { ParticipationDivisionInfoPaymentMapModel } from './participation-division-info-pament-map.model';

export class ApplicationPaymentSnapshotModel {
  id: IApplicationPaymentSnapshotModelData['id'];
  createdAt: IApplicationPaymentSnapshotModelData['createdAt'];
  normalAmount: IApplicationPaymentSnapshotModelData['normalAmount'];
  earlybirdDiscountAmount: IApplicationPaymentSnapshotModelData['earlybirdDiscountAmount'];
  combinationDiscountAmount: IApplicationPaymentSnapshotModelData['combinationDiscountAmount'];
  totalAmount: IApplicationPaymentSnapshotModelData['totalAmount'];
  applicationPaymentId: IApplicationPaymentSnapshotModelData['applicationPaymentId'];
  participationDivisionInfoPaymentMaps: ParticipationDivisionInfoPaymentMapModel[];

  constructor(data: IApplicationPaymentSnapshotModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.normalAmount = data.normalAmount;
    this.earlybirdDiscountAmount = data.earlybirdDiscountAmount;
    this.combinationDiscountAmount = data.combinationDiscountAmount;
    this.totalAmount = data.totalAmount;
    this.applicationPaymentId = data.applicationPaymentId;
    this.participationDivisionInfoPaymentMaps = data.participationDivisionInfoPaymentMaps.map(
      (participationDivisionInfoPaymentMap) =>
        new ParticipationDivisionInfoPaymentMapModel(participationDivisionInfoPaymentMap),
    );
  }

  toData(): IApplicationPaymentSnapshotModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      normalAmount: this.normalAmount,
      earlybirdDiscountAmount: this.earlybirdDiscountAmount,
      combinationDiscountAmount: this.combinationDiscountAmount,
      totalAmount: this.totalAmount,
      applicationPaymentId: this.applicationPaymentId,
      participationDivisionInfoPaymentMaps: this.participationDivisionInfoPaymentMaps.map(
        (participationDivisionInfoPaymentMap) => participationDivisionInfoPaymentMap.toData(),
      ),
    };
  }
}
