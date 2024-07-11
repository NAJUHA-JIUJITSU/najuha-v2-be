import { IApplicationOrderPaymentSnapshotModelData } from '../interface/application-order-payment-sanpshot.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ParticipationDivisionInfoPaymentModel } from './participation-division-info-payment.model';

export class ApplicationOrderPaymentSnapshotModel {
  /** properties */
  private readonly _id: IApplicationOrderPaymentSnapshotModelData['id'];
  private readonly _createdAt: IApplicationOrderPaymentSnapshotModelData['createdAt'];
  private readonly _normalAmount: IApplicationOrderPaymentSnapshotModelData['normalAmount'];
  private readonly _earlybirdDiscountAmount: IApplicationOrderPaymentSnapshotModelData['earlybirdDiscountAmount'];
  private readonly _combinationDiscountAmount: IApplicationOrderPaymentSnapshotModelData['combinationDiscountAmount'];
  private readonly _totalAmount: IApplicationOrderPaymentSnapshotModelData['totalAmount'];
  private readonly _applicationOrderId: IApplicationOrderPaymentSnapshotModelData['applicationOrderId'];
  /** relations */
  private readonly _participationDivisionInfoPayments: ParticipationDivisionInfoPaymentModel[];

  constructor(data: IApplicationOrderPaymentSnapshotModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._normalAmount = data.normalAmount;
    this._earlybirdDiscountAmount = data.earlybirdDiscountAmount;
    this._combinationDiscountAmount = data.combinationDiscountAmount;
    this._totalAmount = data.totalAmount;
    this._applicationOrderId = data.applicationOrderId;
    this._participationDivisionInfoPayments = data.participationDivisionInfoPayments.map(
      (participationDivisionInfoPayment) => new ParticipationDivisionInfoPaymentModel(participationDivisionInfoPayment),
    );
  }

  toData(): IApplicationOrderPaymentSnapshotModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      normalAmount: this._normalAmount,
      earlybirdDiscountAmount: this._earlybirdDiscountAmount,
      combinationDiscountAmount: this._combinationDiscountAmount,
      totalAmount: this._totalAmount,
      applicationOrderId: this._applicationOrderId,
      participationDivisionInfoPayments: this._participationDivisionInfoPayments.map(
        (participationDivisionInfoPayment) => participationDivisionInfoPayment.toData(),
      ),
    };
  }

  approve() {
    this._participationDivisionInfoPayments.forEach((participationDivisionInfoPayment) =>
      participationDivisionInfoPayment.approve(),
    );
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get normalAmount() {
    return this._normalAmount;
  }

  get earlybirdDiscountAmount() {
    return this._earlybirdDiscountAmount;
  }

  get combinationDiscountAmount() {
    return this._combinationDiscountAmount;
  }

  get totalAmount() {
    return this._totalAmount;
  }

  get applicationOrderId() {
    return this._applicationOrderId;
  }

  get participationDivisionInfoPayments() {
    return [...this._participationDivisionInfoPayments];
  }

  cancelParticipationDivisionInfoPayments(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    this._participationDivisionInfoPayments
      .filter((participationDivisionInfoPayment) =>
        participationDivisionInfoIds.includes(participationDivisionInfoPayment.participationDivisionInfoId),
      )
      .forEach((participationDivisionInfoPayment) => participationDivisionInfoPayment.cancel());
  }
}
